var sha512 = require('js-sha512').sha512;
var _ = require('lodash');
var settings = require('../enviromentConfig');
var AWS = require("aws-sdk");

AWS.config.update(settings.AWSSettings);

function DnaRepository() {
  var dnaRepo = {};

  function getHashKey(inputValues) {
    var sourceString = '';
    _.each(inputValues, function (row) {
      _.each(row, function (char) {
        sourceString += char + '|'; //Represent the matrix as a linear string
      });
      sourceString += '.';
    });
    return sha512(sourceString);
  }

  function compareDnaInfo(dnaInfo1, dnaInfo2) {
    return _.isEqual(dnaInfo1, dnaInfo2);
  }

  function increaseStatsCounter(counterKey, docClient, done, hashKey) {
// Increase counters...
    var params = {
      TableName: 'dnaStats',
      Key: {
        "counterDescriptor": counterKey
      },
      UpdateExpression: "set #ct = #ct + :val",
      ExpressionAttributeValues: {
        ":val": 1
      },
      ExpressionAttributeNames: {
        "#ct": "count"
      }
    };
    console.log("Updating the item counter...");
    docClient.update(params, function (err, data) {
      if (err) {
        console.error("Unable to update item counter. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("UpdateItem counter succeeded:", JSON.stringify(data, null, 2));
      }
      done(hashKey, err, data);
    });
  }

  function updateStats(data, dnaInfo, err, counterKey, docClient, done, hashKey) {
    console.log("Added item:", JSON.stringify(data, null, 2));
    var isNewDna = data.Attributes === undefined; //new data

    if (isNewDna) {
      increaseStatsCounter(counterKey, docClient, done, hashKey);
    } else {
      if (!compareDnaInfo(dnaInfo, JSON.parse(data.Attributes.dnaInfo))) {
        err = 'Collision detected hash duplicated :(... something went wrong.';
      }
      done(hashKey, err, data);
    }

  }

  dnaRepo.saveDna = function (dnaInfo, done) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var hashKey = getHashKey(dnaInfo.inputValidation.inputValues);
    //This hash pretends to be unique for each matrix combination
    // also it is a short key if we work with big dna matrix
    // TODO: the possibility of collisions is very low but we may need to implement a colision awarness algorithm
    console.log('Saving.... ' + hashKey);
    var table = '';
    var counterKey = '';
    var counterSlot = Math.floor(Math.random() * 25);

    if (dnaInfo.isMutant) {
      table = 'MutantDNAs';
      counterKey = 'mutantStat' + counterSlot;
    } else {
      table = 'NonMutantDNAs';
      counterKey = 'nonMutantStat' + counterSlot;
    }
    var params = {
      TableName: table,
      Item: {
        "dnaHash": hashKey,
        "dnaInfo": JSON.stringify(dnaInfo)
      },
      ReturnValues: 'ALL_OLD'
    };
    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
      if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        done(hashKey, err, data);
      } else {
        updateStats(data, dnaInfo, err, counterKey, docClient, done, hashKey);
      }
    });
  };


  return dnaRepo;
}

module.exports = DnaRepository();
var AWS = require('aws-sdk');
var settings = require('../enviromentConfig');

AWS.config.update(settings.AWSSettings);

var dynamodb = new AWS.DynamoDB();

var task = function (done) {
// Waits for tables to be come ACTIVE.
// Useful for waiting for table operations like CreateTable to complete.
  var params = {
    TableName: 'dnaStats'
  };
// Supports 'tableExists' and 'tableNotExists'
  dynamodb.waitFor('tableExists', params, function (err, data) {
    if (err) console.log(err); // an error occurred
    else insertData(); // successful response
  });

  function insertData() {
    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log("Preparing stats table....");

    var batchInsert = {
      RequestItems: {
        dnaStats: []


      }
    };

    var mutantArray = [];
    var nonMutantArray = [];

    for (var i = 0; i < 25; i++) //I am using 25 buckets for statistics record
    {
      var mutantRow = {
        PutRequest: {
          Item: {
            "counterDescriptor": {"S": "mutantStat" + i},
            "count": {"N": "0"}
          }
        }
      };
      var nonMutantRow =
        {
          PutRequest: {
            Item: {
              "counterDescriptor": {"S": "nonMutantStat" + i},
              "count": {"N": "0"}
            }
          }
        };
      mutantArray.push(mutantRow);
      nonMutantArray.push(nonMutantRow);

    }
    batchInsert.RequestItems.dnaStats = mutantArray;
    dynamodb.batchWriteItem(batchInsert, function (err, data) {
      if (err) {
        console.error("Unable to add", batchInsert, ". Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("PutItem succeeded:", batchInsert);
      }
      batchInsert.RequestItems.dnaStats = nonMutantArray;
      dynamodb.batchWriteItem(batchInsert, function (err, data) {
        if (err) {
          console.error("Unable to add", batchInsert, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("PutItem succeeded:", batchInsert);
        }
        done();
      });
    });

  }
};


module.exports = task;
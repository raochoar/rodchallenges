var AWS = require('aws-sdk');
var settings = require('../enviromentConfig');

AWS.config.update(settings.AWSSettings);

var dynamodb = new AWS.DynamoDB();

var task = function (done) {

  function createTables() {
    createMutantTable(done);
  }

  function createMutantTable(done) {
    var params = {
      TableName: "MutantDNAs",
      KeySchema: [
        {AttributeName: "dnaHash", KeyType: "HASH"}  //Partition key
      ],
      AttributeDefinitions: [
        {AttributeName: "dnaHash", AttributeType: "S"}
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    };

    dynamodb.createTable(params, function (err, data) {
      if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        done();
      } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        createNonMutansTable(done);
      }
    });
  }

  function createNonMutansTable(done) {
    var params = {
      TableName: "NonMutantDNAs",
      KeySchema: [
        {AttributeName: "dnaHash", KeyType: "HASH"}  //Partition key
      ],
      AttributeDefinitions: [
        {AttributeName: "dnaHash", AttributeType: "S"}
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    };
    dynamodb.createTable(params, function (err, data) {
      if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        done();
      } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        createStatsTable(done);
      }
    });
  }

  function createStatsTable(done) {
    var params = {
      TableName: "dnaStats",
      KeySchema: [
        {AttributeName: "counterDescriptor", KeyType: "HASH"}  //Partition key
      ],
      AttributeDefinitions: [
        {AttributeName: "counterDescriptor", AttributeType: "S"}
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    };
    dynamodb.createTable(params, function (err, data) {
      if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        done();
      } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        done();
      }
    });
  }

  createTables(done);

};

module.exports = task;





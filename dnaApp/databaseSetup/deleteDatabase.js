var AWS = require("aws-sdk");
var _ = require('lodash');
var settings = require('../enviromentConfig');

AWS.config.update(settings.AWSSettings);

var dynamodb = new AWS.DynamoDB();
var tables = ['MutantDNAs', 'NonMutantDNAs', 'dnaStats'];

_.each(tables, function (table) {
  var params = {
    TableName: table
  };

  dynamodb.deleteTable(params, function (err, data) {
    if (err) {
      console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
  });
});


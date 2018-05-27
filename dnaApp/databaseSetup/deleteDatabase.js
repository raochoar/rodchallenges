var AWS = require("aws-sdk");
var settings = require('../environmentConfig');

AWS.config.update(settings.AWSSettings);

var dynamodb = new AWS.DynamoDB();
var tables = ['MutantDNAs', 'NonMutantDNAs', 'dnaStats'];

var task = function (done) {

  var i = 0;
  deleteTable(tables[i]);

  function deleteTable(table) {
    var params = {
      TableName: table
    };

    dynamodb.deleteTable(params, function (err, data) {
      if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
      }
      waitForDelete(table);
    });
  }

  function waitForDelete(table) {
    var params = {
      TableName: table
    };
    console.log('Waiting for deletion of' + table);
    dynamodb.waitFor('tableNotExists', params, function (err, data) {
      if (err) console.log(err); // an error occurred
      console.log('Table deleted:' + params.TableName);
      i++;
      if (i < tables.length) {
        deleteTable(tables[i]); //Next table.
      } else {
        done();
      }
    });
  }
};

module.exports = task;
var AWS = require('aws-sdk');
var settings = require('../enviromentConfig');
var createTables = require('./createTables');
var deleteDatabase = require('./deleteDatabase');
var populateInitialData = require('./populateInitialData');

AWS.config.update(settings.AWSSettings);

var dynamodb = new AWS.DynamoDB();

var Helper = function () {
  var helper = {};

  helper.initDatabase = function (done) {
    deleteDatabase(function () {
      createTables(function () {
        populateInitialData(function () {
          done();
        })
      });
    });
  };

  return helper;
};

module.exports = Helper();

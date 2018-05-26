/**
 * This test requires access to a dynamoDB (local or remote)
 */
var dnaRepository = require('../dnaLogic/dnaRepository');
var expect = require('chai').expect;
var dbHelper = require('../databaseSetup/databaseHelper');

describe('This spec test the database access layer of this app', function () {
  before('Prepare Database', function (done) {
    dbHelper.initDatabase(done);

  });
  it('has to store a regular dna', function (done) {
    var dnaSample = {
      "isMutant": false,
      "inputValidation": {
        "isValid": true,
        "message": "",
        "inputValues": [
          ["A", "T", "G", "C", "G", "A"],
          ["C", "A", "G", "T", "G", "C"],
          ["T", "T", "A", "T", "T", "T"],
          ["A", "G", "A", "C", "G", "G"],
          ["G", "C", "G", "T", "C", "A"],
          ["T", "C", "A", "C", "T", "G"]
        ]
      }
    };
    dnaRepository.saveDna(dnaSample, doneFunc);

    function doneFunc() {
      done();
    }
  });

  it('hast to store a mutant dna', function (done) {
    var dnaSample = {
      "isMutant": true,
      "inputValidation": {
        "isValid": true,
        "message": "",
        "inputValues": [
          ["A", "T", "G", "C", "G", "A"],
          ["C", "A", "G", "T", "G", "C"],
          ["T", "T", "A", "T", "G", "T"],
          ["A", "G", "A", "A", "G", "G"],
          ["C", "C", "C", "C", "T", "A"],
          ["T", "C", "A", "C", "T", "G"]
        ]
      }
    }
    dnaRepository.saveDna(dnaSample, doneFunc);

    function doneFunc() {
      done();
    }
  })
});
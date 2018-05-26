/**
 * This test requires access to a dynamoDB (local or remote)
 */
var dnaRepository = require('../dnaLogic/dnaRepository');
var expect = require('chai').expect;
var dbHelper = require('../databaseSetup/databaseHelper');
var _ = require('lodash');

describe('E2E test, it use external resource like database', function () {
  var dnaHumanSample = {
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

  var dnaMutantSample = {
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
  };

  beforeEach('Prepare Database', function (done) {
    dbHelper.initDatabase(done);

  });

  describe('REST layer test', function () {
    var expect = require('chai').expect;
    var request = require('supertest');
    var app = require("../app.js");

    it('has to return the correct stats', function (done) {
      var expectedResult = {
        "count_mutant_dna": 1,
        "count_human_dna": 1,
        "ratio": 0.5
      };
      dnaRepository.saveDna(dnaMutantSample, function () {
        dnaRepository.saveDna(dnaHumanSample, function () {
          request(app)
            .get('/stats')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;
              expect(_.isEqual(res.body, expectedResult)).to.true;
              done();
            });
        });
      });

    });

    it('has to return 403 if it is a regular dna', function (done) {
      var regularDna = {dna: ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG']};
      request(app)
        .post('/mutant')
        .send(regularDna)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(403)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.error.text).to.equal('Sorry this API is not for regular DNA.');
          done();
        });
    });

    it('has to detect a mutant and returns 200', function (done) {
      var sampleMutant = {
        dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG']
      };
      request(app)
        .post('/mutant')
        .send(sampleMutant)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.text).to.equal('Welcome to the XMen team, you are a great mutant!');
          done();
        });
    });
  });

  describe('Database tests', function () {
    it('has to store a regular dna', function (done) {

      dnaRepository.saveDna(dnaHumanSample, doneFunc);

      function doneFunc(hashKey, err, data) {
        expect(err).to.be.null;
        expect(_.isEqual({}, data)).to.be.true;
        dnaRepository.getDnaByHash(hashKey, function (err, data) {
          expect(hashKey).to.not.be.null;
          expect(err).to.be.null;
          expect(_.isEqual(data.inputValidation, dnaHumanSample.inputValidation));
          done();
        });

      }
    });

    it('hast to store a mutant dna', function (done) {

      dnaRepository.saveDna(dnaMutantSample, doneFunc);

      function doneFunc(hashKey, err, data) {
        expect(err).to.be.null;
        expect(_.isEqual({}, data)).to.be.true;
        dnaRepository.getDnaByHash(hashKey, function (err, data) {
          expect(hashKey).to.not.be.null;
          expect(err).to.be.null;
          expect(_.isEqual(data.inputValidation, dnaMutantSample.inputValidation));
          done();
        });

      }
    });

    it('has to bring the current stats', function (done) {
      dnaRepository.getDnaStats(function (err, data) {
        expect(data.count_mutant_dna).to.equal(0);
        expect(data.count_human_dna).to.equal(0);
        expect(data.ratio).to.equal(0);
        done();
      });
    });

    it('has to return 1 mutant and 1 human stats', function (done) {
      dnaRepository.saveDna(dnaMutantSample, function () {
        dnaRepository.saveDna(dnaHumanSample, function () {
          dnaRepository.getDnaStats(function (err, data) {
            expect(data.count_mutant_dna).to.equal(1);
            expect(data.count_human_dna).to.equal(1);
            expect(data.ratio).to.equal(0.5);
            done();
          });
        });
      });
    });

    it('has not to add duplicate entries in database', function (done) {
      dnaRepository.saveDna(dnaMutantSample, function () {
        dnaRepository.saveDna(dnaHumanSample, function () {
          dnaRepository.saveDna(dnaMutantSample, function () {
            dnaRepository.saveDna(dnaHumanSample, function () {
              dnaRepository.getDnaStats(function (err, data) {
                expect(data.count_mutant_dna).to.equal(1);
                expect(data.count_human_dna).to.equal(1);
                expect(data.ratio).to.equal(0.5);
                done();
              });
            });
          });
        });
      });
    });

  });
});
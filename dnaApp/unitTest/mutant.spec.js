var expect = require('chai').expect;
var request = require('supertest');
var proxyquire = require('proxyquire');



describe('This is a set of test of mutant REST api', function () {
  var dnaRepositoryStub;

  beforeEach(function () {
    dnaRepositoryStub = {
      saveDna: function (result, done) {
        done('mockHash', null, null);
      }
    };
    app = proxyquire('../app.js', {'./dnaLogic/dnaRepository': dnaRepositoryStub});
  });

  it('has to return 500 when a repository returns an error', function (done) {
      dnaRepositoryStub.saveDna = function (result, d) {
        d('mockHash', 'something went worng', null);
      };

      var sampleMutant = {
        dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG']
      }
      request(app)
        .post('/mutant')
        .send(sampleMutant)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(500)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.text).to.equal('Something went worng, please try later..');
          done();
        });
    }
  );

  it('has to detect wrong dna samples like irregular matrixs and return 400', function (done) {
    var irregularDna = {dna: ['ATGCGA', 'CAGTGC', 'TTATTDDDDDDT', 'AGACGG', 'GCGTCA', 'TCACTG']};
    request(app)
      .post('/mutant')
      .send(irregularDna)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.error.text).to.equal('This API works only for NxN matrix. So height and width of the matrix has to be equal.');
        done();
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
    }
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

  it('has to detect wrong input formats and return 400', function (done) {
    request(app)
      .post('/mutant')
      .send('epepepe') // x-www-form-urlencoded upload
      .expect(400)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.error.text).to.equal('Your request is not valid, please send content/type headers and a valid json.');
        done();
      });

  });
});
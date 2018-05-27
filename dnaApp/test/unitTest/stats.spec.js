var expect = require('chai').expect;
var request = require('supertest');
var proxyquire = require('proxyquire');


describe('This is a set of test of STATS REST api', function () {
  var dnaRepositoryStub;

  beforeEach(function () {
    dnaRepositoryStub = {
      getDnaStats: function (callback) {
        callback(null, 'mockdata');
      }
    };
    app = proxyquire('../../app.js', {'./dnaLogic/dnaRepository': dnaRepositoryStub});
  });

  it('has to return correct stats response', function (done) {
    request(app)
      .get('/stats')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.null;
        expect(res.text).to.equal('"mockdata"');
        done();
      });
  });

  it('has to return correct stats response', function (done) {
    dnaRepositoryStub.getDnaStats = function (callback) {
      callback('error', 'mockdata');
    };

    request(app)
      .get('/stats')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(500)
      .end(function (err, res) {
        expect(err).to.null;
        expect(res.text).to.equal('Something went wrong.');
        done();
      });
  });

});
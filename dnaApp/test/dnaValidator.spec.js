var expect = require('chai').expect;
var dnaValidator = require('../dnaLogic/dnaValidator')
describe('Validate dna values', function() {
    it('Returns a  valid validator object', function() {
        var validator = dnaValidator();
        expect(validator).not.to.be.null;
    })
});
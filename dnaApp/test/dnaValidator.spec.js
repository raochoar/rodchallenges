var _ = require('lodash');
var expect = require('chai').expect;
var dnaValidator = require('../dnaLogic/dnaValidator');

describe('Validate dna values', function () {
  it('Returns a  valid validator object', function () {
    var validator = dnaValidator();
    expect(validator).not.to.be.null;
  });

  it('has to returns the number of horizontal matches', function () {
    var inputSample = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
    var validator = dnaValidator();
    var result = validator.getHorizontalMatches(inputSample);
    expect(result).to.equal(1);
  });

  it('has to detect 2 matches in the same row', function () {
    var inputSample = ['CCCCATTTTTCGGGACCCC'];
    var validator = dnaValidator();
    var result = validator.getHorizontalMatches(inputSample);
    expect(result).to.equal(3);
  });

  it('has to detect 3 matches in different rows', function () {
    var inputSample = ['AGGGGA', 'CAGTGC', 'TTATGT', 'AGAAAA', 'CCCCTA', 'TCACTG'];
    var validator = dnaValidator();
    var result = validator.getHorizontalMatches(inputSample);
    expect(result).to.equal(3);
  });

  it('has to detect 2 matches with same letter', function () {
    var inputSample = ['AAAAAATAAAA'];
    var validator = dnaValidator();
    var result = validator.getHorizontalMatches(inputSample);
    expect(result).to.equal(2);
  });

  it('has to detect 1 vertical match', function () {
    var inputSample = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
    var validator = dnaValidator();
    var result = validator.getVerticalMatches(inputSample);
    expect(result).to.equal(1);
  });

  it('hast to detect 1 diagonal match', function () {
    var inputSample = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
    var validator = dnaValidator();
    var result = validator.getDiagonalMatches(inputSample);
    expect(result).to.equal(1);
  });

  it('has to return all the valid diagonals with at least 4 items', function () {
    var expectedArray = [
      ["T", "C", "A",  "T", "G", "A" ],
      ["G", "T", "A",  "A", "A", "A" ],
      ["C", "G", "A",  "T", "G"],
      ["A", "G", "T",  "G", "T"],
      ["C", "T", "A",  "C", "T"],
      ["C", "G", "A",  "C", "C"],
      ["A", "T", "G",  "C"],
      ["G", "G", "T", "G"],
      ["T", "G", "C", "C"],
      ["T", "G", "C", "A"]
    ];
    var inputSample = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
    var validator = dnaValidator();
    var result = validator.getArrayOfDiagonalWords(inputSample);
    var arraysEquality = _.isEqual(result, expectedArray);
    expect(arraysEquality).to.true;
  });
});
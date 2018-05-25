var _ = require('lodash');
var expect = require('chai').expect;
var dnaValidator = require('../dnaLogic/dnaValidator');

describe('Validate dna values', function () {
  describe('ADN patterns test', function () {
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
      inputSample = validator.getValidMatrix(inputSample).inputValues;
      var result = validator.getVerticalMatches(inputSample);
      expect(result).to.equal(1);
    });

    it('hast to detect 1 diagonal match', function () {
      var inputSample = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
      var validator = dnaValidator();
      inputSample = validator.getValidMatrix(inputSample).inputValues;
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

  describe('Input validation unit tests', function(){
    it('has to fail when the matrix size is corrupted', function(){
      var inputSample = ['ATGCGA', 'CAGTGC', 'TTAAAATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
      var validator = dnaValidator();
      var result = validator.getValidMatrix(inputSample);
      expect(result.isValid).to.false;
      expect(result.message).to.be.equal('This API works only for NxN matrix. So height and width of the matrix has to be equal.');
    });

    it('has to fail when the matrix character are invalid', function(){
      var inputSample = ['ATGCGA', 'CAGTGC', 'AGAAGG', 'AGZAGG', 'CCCCTA', 'TCACTG'];
      var validator = dnaValidator();
      var result = validator.getValidMatrix(inputSample);
      expect(result.isValid).to.false;
      expect(result.message).to.be.equal('Just valid dna letters are supported.');
    });

    it('has to fail when the matrix is not a array of strings', function(){
      var inputSample = ['ATGCGA', 'CAGTGC', 2, 'AGZAGG', 'CCCCTA', 'TCACTG'];
      var validator = dnaValidator();
      var result = validator.getValidMatrix(inputSample);
      expect(result.isValid).to.false;
      expect(result.message).to.be.equal('The array has to be a valid array of just strings.');
    });

    it('has to fail when the input is not a array character are invalid', function(){
      var inputSample = 'ATGCA';
      var validator = dnaValidator();
      var result = validator.getValidMatrix(inputSample);
      expect(result.isValid).to.false;
      expect(result.message).to.be.equal('Please enter a valid array of strings.');
    });



    it('has to return true if the matrix is valid', function(){
      var inputSample = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
      var expectedMatrix = [
        [ "A", "T", "G", "C", "G", "A"],
        [ "C", "A", "G", "T", "G", "C"],
        [ "T", "T", "A", "T", "G", "T"],
        [ "A", "G", "A", "A", "G", "G"],
        [ "C", "C", "C", "C", "T", "A"],
        [ "T", "C", "A", "C", "T", "G"]
      ];
      var validator = dnaValidator();
      var result = validator.getValidMatrix(inputSample);
      expect(result.isValid).to.true;
      expect(_.isEqual(result.inputValues, expectedMatrix)).to.true;
      expect(result.message).to.be.equal('');
    });
  });

  describe('Test of isMutant main method', function() {
    it('has to detect mutant dna', function(){
      var inputSample = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
      var validator = dnaValidator();
      var result = validator.isMutant(inputSample);
      expect(result.isMutant).to.be.true;
    });

    it('has to detect mutant dna with 2 diagonal matches', function(){
      var inputSample = [
        'ACAACA',
        'CAGTGA',
        'TTATAT',
        'AGAAGG',
        'CTACTA',
        'TCACTG'];
      var validator = dnaValidator();
      var result = validator.isMutant(inputSample);
      expect(result.isMutant).to.be.true;
    });

    it('has to detect mutant dna with 2 horizontal matches', function(){
      var inputSample = ['AAAACA',
                         'CAGTGC',
                         'TTATGT',
                         'AGAAGG',
                         'CCCCTA',
                         'TCACTG'];
      var validator = dnaValidator();
      var result = validator.isMutant(inputSample);
      expect(result.isMutant).to.be.true;
    });

    it('has to detect regular dna non-mutant', function() {
      var inputSample = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'];
      var validator = dnaValidator();
      var result = validator.isMutant(inputSample);
      expect(result.isMutant).to.be.false;
    });

    it('has to detect invalid inputs', function() {
      var inputSample = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCAAAAACTG'];
      var validator = dnaValidator();
      var result = validator.isMutant(inputSample);
      expect(result.isMutant).to.be.null;
      expect(result.inputValidation.isValid).to.be.false;
    });
    //TODO: Add more scenarios here.

  });
});
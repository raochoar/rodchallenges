var _ = require('lodash');

function DnaValidator() {
  var validator = {};
  var validLetters = ['A', 'C', 'G', 'T'];

  function hasHorizontalMatch(word) {
    var prevLetter = '';
    var count = 1;
    var matches = 0;
    var hasMatched = false; //flag to detect matches.
    _.each(word, function (letter) {
      if (prevLetter === letter) {
        count++;
        if (count >= 4) {
          hasMatched = true;
        }
      } else {
        if (hasMatched) {
          matches++;
        }
        prevLetter = letter;
        count = 1;
        hasMatched = false;
      }
    });
    if (hasMatched) { //last match case.
      matches++;
    }
    return matches; //return true if it has a horizontal match.
  }

  validator.getHorizontalMatches = function (inputValues) {
    var matcherCounter = 0;
    _.each(inputValues, function (word) {
      matcherCounter = matcherCounter + hasHorizontalMatch(word);
    });
    return matcherCounter;
  };

  //Since the input is an array of string, we need a matrix
  //to improve the process.
  function sanitizeInput(inputValues) {
    var result = [];
    _.each(inputValues, function (row) {
      result.push(_.toArray(row)); // move into an array
    });
    return result;
  }

  validator.getVerticalMatches = function (inputValues) {

    var newValues = _.zip.apply(_, inputValues); //transpond the matrix using lodash
    return validator.getHorizontalMatches(newValues);
  };


  validator.getArrayOfDiagonalWords = function (inputValues) {

    var newValues = [];
    //Work for NxN matrix where rows and cols are the same value. i> 2 because I need at least 4 items diag
    for (var i = inputValues[0].length - 1; i > 2; i--) {
      var firstColDownUpDiag = [], lastColDownUpDiag = [];
      var firstColUpDownDiag = [], lastColUpDownDiag = [];
      var yDecrement = i;
      var yIncrement = inputValues.length - i - 1;
      var xDecrement = inputValues[yIncrement].length - 1;
      var xIncrement = 0;

      firstColDownUpDiag.push(inputValues[i][0]);
      lastColDownUpDiag.push(inputValues[i][xDecrement]);
      firstColUpDownDiag.push(inputValues[yIncrement][xIncrement]);
      lastColUpDownDiag.push(inputValues[yIncrement][xDecrement]);

      while (yDecrement > 0 && xIncrement < inputValues[i].length && xDecrement > 0 && yIncrement < inputValues.length) {
        yDecrement--;
        yIncrement++;
        xIncrement++;
        xDecrement--;
        firstColDownUpDiag.push(inputValues[yDecrement][xIncrement]);
        lastColDownUpDiag.push(inputValues[yDecrement][xDecrement]);
        firstColUpDownDiag.push(inputValues[yIncrement][xIncrement]);
        lastColUpDownDiag.push(inputValues[yIncrement][xDecrement]);
      }

      newValues.push(firstColDownUpDiag);
      newValues.push(lastColDownUpDiag);
      if (inputValues.length - i - 1 > 0) { //Don't add main diagonal to avoid duplicated.
        newValues.push(firstColUpDownDiag);
        newValues.push(lastColUpDownDiag);
      }


    }
    return newValues;
  };

  validator.getDiagonalMatches = function (inputValues) {
    var newValues = validator.getArrayOfDiagonalWords(inputValues);
    return validator.getHorizontalMatches(newValues);
  };


  validator.getValidMatrix = function (inputValues) {
    var result = {isValid: true, message: ''};
    if (!_.isArray(inputValues)) {
      result.isValid = false;
      result.message = 'Please enter a valid array of strings.';
      return result;
    }
    var matrixSize = inputValues.length;
    _.each(inputValues, function (row) {
      if (!_.isString(row)) {
        result.isValid = false;
        result.message = 'The array has to be a valid array of just strings.';
        return false;
      }
      if (row.length != matrixSize) {
        result.isValid = false;
        result.message = 'This API works only for NxN matrix. So height and width of the matrix has to be equal.';
        return false;
      }
      var validCharacters = _.every(row, function (letter) {
        return validLetters.indexOf(letter) >= 0;
      });
      if (!validCharacters) {
        result.isValid = false;
        result.message = 'Just valid dna letters are supported.';
      }
      return result.isValid; //Break the loop after the first error;
    });
    if (result.isValid) {
      result.inputValues = sanitizeInput(inputValues); //convert into a valid matrix to improve usage of loadash.
    }
    return result;

  };

  /*
    This method return isMutant true or false
    if the input validation is not valid a null value will be returned
   */
  validator.isMutant = function (inputValues) {
    var result = {
      isMutant: null,
      inputValidation: null
    };

    result.inputValidation = validator.getValidMatrix(inputValues);
    if (result.inputValidation.isValid) {
      var sanitizedMatrix = result.inputValidation.inputValues;
      var matchesCounter = 0;
      matchesCounter += validator.getHorizontalMatches(sanitizedMatrix);
      if (matchesCounter > 1) {
        result.isMutant = true;
        return result;
      }
      matchesCounter += validator.getVerticalMatches(sanitizedMatrix);
      if (matchesCounter > 1) {
        result.isMutant = true;
        return result;
      }
      matchesCounter += validator.getDiagonalMatches(sanitizedMatrix);
      if (matchesCounter > 1) {
        result.isMutant = true;
        return result;
      }
      result.isMutant = false; //not a mutant
    }
    return result;

  };

  return validator;
}

module.exports = DnaValidator();
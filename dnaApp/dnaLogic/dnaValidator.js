var _ = require('lodash');

/*
TODO: improvement area, if the business doesn't require to get full match statistics of
mutant dna, we can improve this breaking the search after the second match. That will
improve the performance in some cases.
 */
function DnaValidator() {
  var validator = {};
  var validLetters = ['A', 'C', 'G', 'T'];

  /**
   * This function detects horizontal matches in an array
   * @param word An array of words to analyze
   * @returns {number} The number of matches found
   */
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

  /**
   * This function analyze the horizontal matches in a matrix
   * it iterates over every row and use other function to complete
   * the analysis.
   * @param inputValues
   * @returns {number}
   */
  validator.getHorizontalMatches = function (inputValues) {
    var matcherCounter = 0;
    _.each(inputValues, function (word) {
      matcherCounter = matcherCounter + hasHorizontalMatch(word);
    });
    return matcherCounter;
  };

  /**
   * Converts an array of strings into a matrix of strings
   * this is required to consume the values with lodash
   * @param inputValues
   * @returns {Array}
   */
  function sanitizeInput(inputValues) {
    var result = [];
    _.each(inputValues, function (row) {
      result.push(_.toArray(row)); // move into an array
    });
    return result;
  }

  /**
   * This method returns the number of vertical matches in a matrix
   * it use loads to turn the matrix and reuse the horizontal algorithm
   * to finish the analysis.
   * @param inputValues
   * @returns {number}
   */
  validator.getVerticalMatches = function (inputValues) {

    var newValues = _.zip.apply(_, inputValues); //transpond the matrix using lodash
    return validator.getHorizontalMatches(newValues);
  };

  /**
   * This method returns an array of every possible
   * diagonal with more than 4 items.
   * @param inputValues
   * @returns {Array}
   */
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
  /**
   * This function return the number of diagonal matches.
   * @param inputValues
   * @returns {number}
   */
  validator.getDiagonalMatches = function (inputValues) {
    var newValues = validator.getArrayOfDiagonalWords(inputValues);
    return validator.getHorizontalMatches(newValues);
  };

  /**
   * This method validate the source matrix.
   * It returns a boolean with the status and a message
   * if the matrix is not valid.
   * @param inputValues
   * @returns {{isValid: boolean, message: string}}
   */
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

  /**
   * Main entrance to validate if a array of string
   * represent or not a mutant dna.
   * Returns a new inputValidation matrix of string
   * ready to be stored.
   * Also return the boolean flag of mutant status
   * @param inputValues
   * @returns {{isMutant: null, inputValidation: null}}
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
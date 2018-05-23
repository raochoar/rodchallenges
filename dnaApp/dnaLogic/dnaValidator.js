var _ = require('lodash');

function DnaValidator() {
  var validator = {};

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
    if(hasMatched) { //last match case.
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
    _.each(inputValues, function(row){
      result.push(_.toArray(row)); // move into an array
    });
    return result;
  }

  validator.getVerticalMatches = function(inputValues) {
    inputValues = sanitizeInput(inputValues); //TODO: remove it
    var newValues = _.zip.apply(_, inputValues); //transpond the matrix using lodash
    return validator.getHorizontalMatches(newValues);
  };


  validator.getArrayOfDiagonalWords = function(inputValues) {
    inputValues = sanitizeInput(inputValues); //TODO: remove it
    var newValues = [];
    //Work for NxN matrix where rows and cols are the same value. i> 2 because I need at least 4 items diag
    for(var i=inputValues[0].length - 1; i > 2; i--)
    {
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

      while(yDecrement > 0 && xIncrement < inputValues[i].length && xDecrement > 0 && yIncrement < inputValues.length)
      {
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
      if(inputValues.length - i - 1 > 0) { //Don't add main diagonal to avoid duplicated.
        newValues.push(firstColUpDownDiag);
        newValues.push(lastColUpDownDiag);
      }


    }
    return newValues;
  };

  validator.getDiagonalMatches = function(inputValues) {
    var newValues = validator.getArrayOfDiagonalWords(inputValues);
    return validator.getHorizontalMatches(newValues);
  };

  return validator;
}

module.exports = DnaValidator;
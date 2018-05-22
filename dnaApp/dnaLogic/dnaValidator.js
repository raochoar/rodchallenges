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
    })
    return result;
  }

  validator.getVerticalMatches = function(inputValues) {
    inputValues = sanitizeInput(inputValues); //TODO: remove it
    var newValues = _.zip.apply(_, inputValues); //transpond the matrix using lodash
    return validator.getHorizontalMatches(newValues);
  };

  function getDiagWords(i,j, inputValues)
  {
    if(inputValues.length - i < 4 && inputValues.length - j < 4)
    {
      return [];
    }
    var wordLeftToRigth = [];
    //It supose that the matrix is a square
    while(i < inputValues.length && j < inputValues.length){
      wordLeftToRigth.push(inputValues[i][j]);
      i++;
      j++;
    }
    return wordLeftToRigth;
  }

  validator.getDiagonalMatches = function(inputValues) {
    inputValues = sanitizeInput(inputValues); //TODO: remove it
    var newValues = [];
    for(var i=0; i < inputValues.length - 3; i++) //last 3 items dosen't fill a row of 4
    {
      for(var j=0; j <inputValues.length; j++) {
        newValues.push(getDiagWords(i,j, inputValues));
      }
    }
    return validator.getHorizontalMatches(newValues);
  };

  return validator;
}

module.exports = DnaValidator;
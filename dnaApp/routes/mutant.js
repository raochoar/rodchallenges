var express = require('express');
var router = express.Router();
var dnaValidator = require('../dnaLogic/dnaValidator');

router.post('/', function (req, res, next) {
  if (!req.body.dna) {
    res.status(400).send('Your request is not valid, please send content/type headers and a valid json.')
  } else {
    var result = dnaValidator.isMutant(req.body.dna);
    if (result.isMutant === null) { //Invalid mutant
      res.status(400).send(result.inputValidation.message);
    } else {
      if (result.isMutant) {
        res.status(200).send('Welcome to the XMen team, you are a great mutant!');
      } else {
        res.status(403).send('Sorry this API is not for regular DNA.');
      }
    }
  }

});

module.exports = router;
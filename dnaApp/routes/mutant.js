var express = require('express');
var router = express.Router();
var dnaValidator = require('../dnaLogic/dnaValidator');
var dnaRepository;

/**
 * This method process a validDna result after save it into
 * the repository layer
 * @param result
 * @param res
 */
function processValidDna(result, res) {
  dnaRepository.saveDna(result, function (hashKey, err, data) {
    if (err != null) {
      res.status(500).send('Something went worng, please try later..');
    } else {
      if (result.isMutant) {
        res.status(200).send('Welcome to the XMen team, you are a great mutant!');
      } else {
        res.status(403).send('Sorry this API is not for regular DNA.');
      }
    }
  });
}

/**
 * This method is the /mutant entry point for
 * post verb
 */
router.post('/', function (req, res, next) {
  if (!req.body.dna) {
    res.status(400).send('Your request is not valid, please send content/type headers and a valid json.')
  } else {
    var result = dnaValidator.isMutant(req.body.dna);
    if (result.isMutant === null) { //Invalid mutant
      res.status(400).send(result.inputValidation.message);
    } else {
      processValidDna(result, res);
    }
  }

});

/**
 * This is a object factory that inject a repository
 * dependency in order to decouple the data access layer
 * form middleware logic.
 * @type {{getRouter: mutantFactory.getRouter}}
 */
var mutantFactory = {
  getRouter: function (repository) {
    dnaRepository = repository;
    return router
  }
};

module.exports = mutantFactory;
var express = require('express');
var dnaRepository;
var router = express.Router();

/**
 * This is the entry point for /stats resource
 * with the get verb
 */
router.get('/', function (req, res, next) {
  dnaRepository.getDnaStats(function (err, data) {
    if (err != null) {
      res.status(500).send('Something went wrong.');
    } else {
      res.json(data);
    }
  })

});

/**
 * This is a object factory that inject a repository
 * dependency in order to decouple the data access layer
 * form middleware logic.
 * @type {{getRouter: mutantFactory.getRouter}}
 */
var statsFactory = {
  getRouter: function (repository) {
    dnaRepository = repository;
    return router
  }
};

module.exports = statsFactory;
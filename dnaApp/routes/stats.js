var express = require('express');
var dnaRepository;
var router = express.Router();

router.get('/', function (req, res, next) {
  dnaRepository.getDnaStats(function (err, data) {
    if (err != null) {
      res.status(500).send('Something went wrong.');
    } else {
      res.json(data);
    }
  })

});

var statsFactory = {
  getRouter: function (repository) {
    dnaRepository = repository;
    return router
  }
};

module.exports = statsFactory;
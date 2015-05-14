var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/FanBoxQuiz', function(req, res, next) {
  res.render('FanBoxQuiz', { title: 'Express' });
});

router.get('/Checkout', function(req, res, next) {
  res.render('Checkout', { title: 'Express' });
});

router.get('/Confirm', function(req, res, next) {
  res.render('Confirm', { title: 'Express' });
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'BF4 Stats', user: req.user || null });
});

router.get('/queries', function(req, res) {
  res.render('index', { title: 'Queries - BF4 Stats', queries: [] });
});


module.exports = router;

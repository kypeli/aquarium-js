var express = require('express');
var router = express.Router();

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/aquarium", {native_parser:true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET measurements */
router.get('/measurements', function(req, res) {
	db.collection('measurements').find().toArray(function(err, items) {
		var m = {}
		m["measurements"] = items;
		res.json(m);
	});
});

/* Put new measurement */
router.post('measurements', function(req, res) {
});

module.exports = router;

var basicAuth = require('basic-auth');
var httpAuth = function (username, password) {
	return function (req, res, next) {
		var user = basicAuth(req);
		if (!user || user.name !== username || user.password !== password) {
      		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      		return res.send(401);
		} else {
			next();
		}
	};
}
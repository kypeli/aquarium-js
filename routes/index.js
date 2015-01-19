var express = require('express');
var auth = require('../utils/http-auth');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET measurements */
router.get('/measurements', function(req, res) {
	app.db.collection('measurements').find().toArray(function(err, items) {
		var m = {}
		m["measurements"] = items;
		res.json(m);
	});
});

/* POST new measurement */
var HTTPUSER = process.env.AQUARIUM_HTTP_USER;
var HTTPPASSWD = process.env.AQUARIUM_HTTP_PASS;
if (!HTTPUSER || !HTTPPASSWD) {
	HTTPUSER = HTTPPASSWD = "NOTHINGNothingNothing###";
}
router.post('/measurements', auth.httpAuth(HTTPUSER, HTTPPASSWD), function(req, res) {
	var measurement = JSON.stringify(req.body);
    console.log("New measurement: " + measurement);
    app.db.collection('measurements').insert(measurement, function (error, doc) 
    {
    	if (error) {
    		console.log("Got DB error");
    		res.send("Error adding value to MongoDB.");
    	}
    });
    res.end();
});

module.exports = router;



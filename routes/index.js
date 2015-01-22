var express = require('express');
var auth = require('../utils/http-auth');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET measurements */
router.get('/v1/measurements', function(req, res) {
	    var now = new Date();
        var timeQuery = now.setHours(now.getHours() - 48) / 1000;
        app.db.collection('measurements').find({ epoch_timestamp : { $gt : timeQuery} }).toArray(function(err, items) {
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
router.post('/v1/measurements/new', auth.httpAuth(HTTPUSER, HTTPPASSWD), function(req, res) {
	var measurement = req.body;

	console.log("JSON: " + measurement)

    console.log("New measurement: " + JSON.stringify(measurement));
    app.db.collection('measurements').insert(measurement, function (error, doc) 
    {
    	if (error) {
    		console.log("Got DB error.");
    		res.send("Error adding value to MongoDB.");
    	}
    });
    res.end();
});

module.exports = router;



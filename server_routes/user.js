var express = require('express');
var collections = ['users'];
var dburi = 'LNdK';
var mongojs = require('mongojs');
var db = mongojs(dburi, collections);
var app = express();
var allowCrossDomain = function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

function findUser(username, callback) {
	db.events.findOne({username: username}, function(err, event) {
		if(err) {
			callback(null);
		} else {
			callback(event);
		}
	})
}


app.post('/update', function(request, response) {
	findUser(request.body.username, function (user) {
		user.interests = request.body.interests;
		//TODO: Update user in the db.
	})

});




module.exports = app;
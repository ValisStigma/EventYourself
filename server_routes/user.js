var express = require('express');
var app = express();
var mongoose = require('mongoose');
var hash = require('password-hash');
var Schema = mongoose.Schema;

mongoose.createConnection('mongodb://localhost/LNdK');
//mongoose.createConnection('mongodb://rolf:StartUp15@ds059644.mongolab.com:59644/heroku_4ph3bdfk');

var userSchema = new Schema({
	username: String,
	password: String,
	interests: Array
});

var User = mongoose.model('User', userSchema, "users");

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



app.post('/update', function(request, response) {
	var username = request.body.username,
		interests = request.body.interests;

	User.findOne({username: username}, function (err, user) {
		user.interests = interests;
		user.save();
		response.send(user ? {username: user.username, interests: user.interests} : null);
	});
});


function getInterests(req, res, next) {
	User.findOne({username: req.session.username}, function (err, user) {
		if (err || !user || !user.interests) {
			req.session.isLoggedIn = false;
			res.status(400).send("user not in database or no interests");
		}
		else {
			req.session.userId = user._id;

			res.send(JSON.stringify(user.interests));
		}
	});
}

function register(res, username, password, interests ,next) {
	"use strict";

	User.findOne({username: username}, function (err, user) {
		if (err) {
			res.status(400).send(err);
		} else if (user) {
			res.status(400).send("Username already exists");
		} else {
			var newUser = new User({
				username: username,
				password: hash.generate(password),
				interests: interests
			});

			newUser.save(function (err, user) {
				if (err) {
					res.status(400).send("Username already exists");
				} else {
					res.json({username: user.username, interests: user.interests});
				}
			});
		}
	});


}

function checkUser(res, username, password, req) {
	"use strict";

	User.findOne({username: username}, function (err, user) {
		if (err || !user) {
			res.status(400).send("Incorrect credentials");
			return;
		}
		if (hash.verify(password, user.password)) {
			req.session.isLoggedIn = true;
			req.session.username = username;
			req.session.userId = user._id;
			req.session.interests = user.interests;

			res.send(user);
		} else {
			req.session.isLoggedIn = false;
			res.status(400).send("Incorrect credentials");
		}
	});

}

app.post('/login', function (req, res, next) {
	"use strict";
	checkUser(res, req.body.username, req.body.password, req);
});

app.put('/register', function (req, res, next) {
	"use strict";
	register(res, req.body.username, req.body.password, req.body.interests ,next);
});

app.get('/', function (req, res) {
	"use strict";
	res.json(req.session.username);
});

app.delete('/logout', function (req, res) {
	"use strict";
	req.session.destroy();
	res.end();
});

app.get('/interests', function(req, res, next) {
	getInterests(req, res, next);
});

module.exports = app;
var express = require('express');
var app = express();
var hash = require('password-hash');
var dburi = 'LNdK';
var collections = ['users'];
var mongojs = require('mongojs');
var db = mongojs(dburi, collections);
var check = require('validator');


function isAdmin(userId) {
    "use strict";
    return false;
}

function getInterests(req, res, next) {
    var data = {};
    db.users.findOne({username: req.session.username}, function (err, doc) {
        if (err || doc === null || !doc.interests) {
            data.success = false;
            req.session.isLoggedIn = false;
            res.status(400).send("user not in database or no interests");

        }
        else {
            req.session.isLoggedIn = true;
            req.session.username = username;
            req.session.userId = doc._id;
            if (isAdmin(doc._id)) {
                req.session.isAdmin = true;
            }
            data.interests = doc.interests;
            res.send(JSON.stringify(data));
        }
    });
}

function register(res, username, password, interests ,next) {
    "use strict";
    var data = {
        success: true,
        redirectUrl: '/',
        userNameTaken: false,
        invalidData: false
    };
    if (check.isLength(username, 3) && check.isLength(password, 3)) {
        var newUser = {
            username: username,
            password: hash.generate(password),
            interests: interests
        };
        db.users.findOne({username: newUser.username}, function (err, doc) {
            if (err) {
                data.success = false;
                res.json(data);
            } else if (doc !== null) {
                data.success = false;
                data.userNameTaken = true;
                res.json(data);
            } else {
                db.users.insert(newUser, function (err, doc) {
                    if (err) {
                        data.success = false;
                        res.json(data);
                    } else {
                        res.json(data);
                    }
                });
            }
        });

    } else {
        data.success = false;
        data.invaliddata = true;
        res.json(data);
        return true;
    }
}

function checkUser(res, username, password, req) {
    "use strict";
    var data = {
        redirectUrl: '/',
        success: true,
        invalidData: false
    };
    if (check.isLength(username, 3) && check.isLength(password, 3)) {
        db.users.findOne({username: username}, function (err, doc) {
            if (err || doc === null) {
                data.success = false;
                req.session.isLoggedIn = false;
                res.status(400).send("Feedback data incomplete");

            }
            if (hash.verify(password, doc.password)) {
                req.session.isLoggedIn = true;
                req.session.username = username;
                req.session.userId = doc._id;
                data.username = username;
                data.interests = doc.interests;
                if (isAdmin(doc._id)) {
                    req.session.isAdmin = true;
                }
                res.send(JSON.stringify(data));
            } else {
                data.success = false;
                req.session.isLoggedIn = false;
                res.status(400).send("Feedback data incomplete");

            }
        });
    } else {
        data.success = false;
        data.invalidData = true;
        res.status(400).send("Feedback data incomplete");

    }
}

app.post('/login', function (req, res, next) {
    "use strict";
    res.setHeader('Content-Type', 'text/json');
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
    var data = {
        success: false,
        notLoggedIn: false
    };
    if (!req.session.isLoggedIn) {
        data.notLoggedIn = true;
    } else {
        req.session.destroy();
        data.success = true;
    }
    res.json(data);
});

app.get('/interests', function(req, res, next) {
    getInterests(req, res, next);
});
module.exports = app;
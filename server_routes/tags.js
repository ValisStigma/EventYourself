/**
 * Created by rafael on 28.11.2015.
 */
var express = require('express');
var collections = ['tags'];
var dbURI = 'LNdK';
var mongojs = require('mongojs');
var db = mongojs(dbURI, collections);
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

function createTag(name, callback){
    var tag = {
        name : name
    };
    db.tags.insert(tag, function(err, newTag) {
        if(err) {
            callback(null);
        } else {
            callback(newTag);
        }
    });
}

app.get('/', function(request, response) {
    db.tags.find({}, function (err, events) {
        if (err) {
            response.json(err);
        } else {
            response.json({events: events});
        }
    });
});

app.post('/', function(request, response) {
    createTag(
        request.body.name,
        function(newTag) {
            if(newTag) {
                response.json(newTag);
            } else {
                response.status(400).send('Tag data incomplete.');
            }
        }

    );
});


module.exports = app;
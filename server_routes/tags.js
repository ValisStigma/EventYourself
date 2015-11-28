/**
 * Created by rafael on 28.11.2015.
 */
var express = require('express');
var collections = ['tags'];

var mongoose = require('mongoose');
mongoose.createConnection('mongodb://rolf:StartUp15@ds059644.mongolab.com:59644/heroku_4ph3bdfk');
var db = mongoose.connection;

var ObjectId = require('mongoose').Types.ObjectId;

var allTags = mongoose.model('tags', new mongoose.Schema({ _id: String, Name: String },
    { collection : 'tags' }) );

mongoose.connect('mongodb://localhost/mydatabase');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('DB connection opened');
    allTags.find({}, function(lo, la

    ){console.log(lo); console.log(la);}
);});
// ...

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://rolf:StartUp15@ds059644.mongolab.com:59644/heroku_4ph3bdfk';
var url = 'mongodb://rolf:StartUp15@ds059644.mongolab.com:59644/heroku_4ph3bdfk';
// Use connect method to connect to the Server
var superTags;
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    superTags = db.collection('tags');
    // Find some documents

});

// ...
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
    db.tags.find({}, function (err, tags) {
        if (err) {
            response.json(err);
        } else {
            response.json({tags: tags});
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
/**
 * Created by rafael on 28.11.2015.
 */
var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//mongoose.createConnection('mongodb://localhost/LNdK');
mongoose.createConnection('mongodb://rolf:StartUp15@ds059644.mongolab.com:59644/heroku_4ph3bdfk');

var tagSchema = new Schema({
	name: String
});

var Tag = mongoose.model('Tag', tagSchema, "tags");


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
    Tag.find({}, function (err, tags) { response.json(err ? err : tags); });
});

app.post('/', function(request, response) {
    //TODO create tags
});


module.exports = app;
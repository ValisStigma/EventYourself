var express = require('express');
var collections = ['feedback'];
var dbURI = 'LNdK';
var mongojs = require('mongojs');
var db = mongojs(dbURI, collections);
var app = express();

function createFeedback(author, text, callback) {
    var feedback = {
        author: author,
        text: text
    };
    db.feedback.insert(feedback, function(err, newFeedback){
        if(err) {
            callback(null);
        } else {
            callback(newFeedback);
        }
    })
}

app.post('/', function(request, response) {
    createFeedback(request.body.author, request.body.text, function(newFeedback) {
        if(newFeedback) {
            response.json(newFeedback);
        } else {
            response.status(400).send("Feedback data incomplete");
        }
    });
});

app.get('/', function(request, response) {
    db.feedback.find({}, function(err, feedback) {
        if (err) {
            response.json(err);
        } else {
            response.json({feedback: feedback});
        }
    });
});

module.exports = app;
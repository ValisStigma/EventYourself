var express = require('express');
var collections = ['events'];
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

function createEvent(name, description, startTime, endTime, category, picture, period, rating, sponsor, location, callback){
    var event = {
        name : name,
        description : description,
        startTime: startTime,
        endTime: endTime,
        category: category,
        picture: picture,
        period: period,
        rating: rating,
        sponsor: sponsor,
        comments:[],
        location:location
    };
    db.events.insert(event, function(err, newEvent) {
        if(err) {
            callback(null);
        } else {
            callback(newEvent);
        }
    });
}

function findEvent(id, callback) {
    db.events.findOne({_id: db.ObjectId(id)}, function(err, event) {
        if(err) {
            callback(null);
        } else {
            callback(event);
        }
    })
}


app.get('/', function(request, response) {
    var interests = request.body.interests;
    if(interests) {
        db.events.find({},{comments:0}, function (err, events) {
            if (err) {
                response.json(err);
            } else {
                var matchedEvents = [];

                var findOne = function (haystack, arr) {
                    return arr.some(function (v) {
                        return haystack.indexOf(v) >= 0;
                    });
                };

                events.forEach(function(event) {
                    if(findOne(event.tags, interests)) {
                        matchedEvents.push(event);
                    }
                    event.comments = [];
                });
                response.json({events: matchedEvents});
            }
        });
    }
    else {
        response.status(400).send('No Interests sended');

    }

});

app.post('/', function(request, response) {
    createEvent(
        request.body.name,
        request.body.description,
        request.body.startTime,
        request.body.endTime,
        request.body.category,
        request.body.picture,
        request.body.period,
        request.body.rating,
        request.body.sponsor,
        request.body.location,
        function(newEvent) {
            if(newEvent) {
                response.json(newEvent);
            } else {
                response.status(400).send('Event data incomplete.');
            }
        }

    );
});

app.get('/:id', function(request, response) {
    findEvent(request.params.id, function(event) {
        if (event) {
            response.json({
                name:event.name,
                description: event.description,
                startTime: event.startTime,
                endTime: event.endTime,
                category: event.category,
                picture: event.picture,
                period: event.period,
                rating: event.rating,
                sponsor: event.sponsor,
                location: event.location,
                order: event.order,
                comments: [],
                tags: event.tags
            });
        } else {
            response.status(404).send('Event (id '+request.params.id+') not found.')
        }
    });
});

app.post('/:id', function(request, response) {
    findEvent(request.params.id, function(event) {
        if (event) {
            if(request.body.name && request.body.name != event.name) {
                event.name = request.body.name;
            }
            if(request.body.description && request.body.description != event.description) {
                event.description = request.body.description;
            }
            if(request.body.targetGroup && event.targetGroup != request.body.targetGroup) {
                event.targetGroup = request.body.targetGroup;
            }
            if(request.body.contributionsDescription && event.contributionsDescription != request.body.contributionsDescription) {
                event.contributionsDescription = request.body.contributionsDescription;
            }
            if(request.body.location && event.location != request.body.location) {
                event.location = request.body.location;
            }
            if(request.body.times && event.times != request.body.times) {
                event.times = request.body.times;
            }
            response.json(event);
        } else {
            response.status(404).send('Event (id '+request.params.id+') not found.')
        }
    });

});




module.exports = app;
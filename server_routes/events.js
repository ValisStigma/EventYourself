var express = require('express');
var collections = ['events'];
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

app.post('/getByTagNames', nocache, function(request, response) {
    var interests = null;
    if(request.body.interests) {
        interests = request.body.interests;
    }
    if(interests) {
        db.events.find({},{comments:0}, function (err, events) {
            if (err) {
                response.json(err);
            } else {
                var matchedEvents = [];

                var findOne = function (haystack, arr) {
                    for(var i = 0; i < haystack.length; i++) {
                        for(var j = 0; j < arr.length; j++) {
                            if(haystack[i].Name == arr[j]) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                events.forEach(function(event) {
                    if(event.tags) {
                        if(findOne(event.tags, interests)) {
                            matchedEvents.push(event);
                        }
                    }

                });
                response.json({events: matchedEvents});
            }
        });
    }
    else {
        response.status(400).send('No Interests sended');

    }

});


app.get('/', nocache, function(request, response) {
    var interests = null;
    if(request.session && request.session.interests) {
        interests = request.session.interests;
    } else if(request.body.interests) {
        interests = request.body.interests;
    }
    if(interests) {
        db.events.find({},{comments:0}, function (err, events) {
            if (err) {
                response.json(err);
            } else {
                var matchedEvents = [];

                var findOne = function (haystack, arr) {
                    for(var i = 0; i < haystack.length; i++) {
                        for(var j = 0; j < arr.length; j++) {
                            if(haystack[i].Name == arr[j]) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                events.forEach(function(event) {
                    if(event.tags) {
                        if(findOne(event.tags, interests)) {
                            matchedEvents.push(event);
                        }
                    }

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
                title:event.title,
                description: event.description,
                time: event.time,
                endTime: event.endTime,
                category: event.category,
                picture: event.picture,
                period: event.period,
                rating: event.rating,
                sponsor: event.sponsor,
                place: event.place,
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
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//mongoose.createConnection('mongodb://localhost/LNdK');
mongoose.createConnection('mongodb://rolf:StartUp15@ds059644.mongolab.com:59644/heroku_4ph3bdfk');

var eventSchema = new Schema({
	title: String,
	place: String,
	time: String,
	tags: Array,
	description: String,
	url: String,
	_id : Schema.ObjectId
});

var Event = mongoose.model('Event', eventSchema, "events");


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
    allEvents.insert(event, function(err, newEvent) {
        if(err) {
            callback(null);
        } else {
            callback(newEvent);
        }
    });
}

function findEvent(id, callback) {
	Event.findOne({"_id": id }, function(err, event) {
        callback(err ? null : event);
    })
}

function containsAny (haystack, arr) {
	for(var i = 0; i < haystack.length; i++) {
		for(var j = 0; j < arr.length; j++) {
			if(haystack[i].Name == arr[j]) {
				return true;
			}
		}
	}
	return false;
}

function getMatchedEvents (events, interests) {
	var matchedEvents = [];

	events.forEach(function(event) {
		if(event.tags && containsAny(event.tags, interests)) {
			matchedEvents.push(event);
		}
	});

	return matchedEvents;
}



app.post('/getByTagNames', nocache, function(request, response) {
    var interests = request.body.interests;

	if(!interests) {
		response.status(400).send('No Interests sended');
		return;
	}

    Event.find({}, function (err, events) {
        if (err) {
            response.json(err);
        } else {
	        response.json({events: getMatchedEvents(events, interests)});
        }
    });


});


app.get('/', nocache, function(request, response) {

	if(!request.session || !request.session.interests)
	{
		response.status(400).send('No Interests sended');
		return;
	}

	var interests = request.session.interests;
    Event.find({}, function (err, events) {
        if (err) {
            response.json(err);
        } else {
            response.json({events: getMatchedEvents(events, interests)});
        }
    });


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
                picture: event.picture,
                place: event.place,
                tags: event.tags,
	            url: event.url
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
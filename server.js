/**
 * Server configuration
 */
var express = require('express');
var bodyParser = require('body-parser');

var events = require('./server_routes/events');
var feedback = require('./server_routes/feedback');


var allowCrossDomain = function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};


/**
 * Basic server
 */
var app = express();
app.use(allowCrossDomain);
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public/webapp'));

// tests, remove this for production
app.use('/tests', express.static(__dirname + '/webapp/tests'));
app.use('/source', express.static(__dirname + '/webapp/source'));

//Route config
app.use('/api/events', events);
app.use('/api/feedback', feedback);

app.on("connection", function (socket) {
	socket.setNoDelay(true);
});

/**
 * Server start
 */
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

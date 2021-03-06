/**
 * Server configuration
 */
var express = require('express');
var bodyParser = require('body-parser');

var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var uuid = require('uuid');

var mongoose = require('mongoose');
var events = require('./server_routes/events');
var feedback = require('./server_routes/feedback');
var tags = require('./server_routes/tags');
var user = require('./server_routes/user');


var allowCrossDomain = function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

//mongoose.connect('mongodb://localhost/LNdK');
mongoose.connect('mongodb://rolf:StartUp15@ds059644.mongolab.com:59644/heroku_4ph3bdfk');



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

app.use(session({
    secret: uuid.v1()
}));
//Route config
app.use('/api/events', events);
app.use('/api/feedback', feedback);
app.use('/api/tags', tags);
app.use('/api/user', user);

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

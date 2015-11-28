require.config({
	// base url relative to the home.html
	baseUrl: './',
	paths: {
		'angular'               : 'frameworks/angular/angular',
		'angularRoute'          : 'classes/modules/angular-route',
		'LNdK'                  : 'classes/modules/LNdK',
		'routesConfig'          : 'classes/routesConfig',
		'navigationController'  : 'classes/controllers/navigationController',
		'homeController'        : 'classes/controllers/homeController',
		'eventController'       : 'classes/controllers/eventController',
		'eventDetailController' : 'classes/controllers/eventDetailController',
		'feedbackController'    : 'classes/controllers/feedbackController',
		'ConfigService'         : 'classes/services/configService',
		'EventsService'         : 'classes/services/eventsService',
		'FeedbackService'       : 'classes/services/feedbackService'
	},

	// angular does not support async loading out of the box -> use the shim loader
	shim: {
		'angular': {
			exports: 'angular'
		},
		'angularRoute': {
			deps: ['angular']
		}
	}
});


require(['angular', 'LNdK'], function (Angular, LNdK) {

	Angular.element(document).ready(function() {
		Angular.bootstrap(document, [ LNdK.name ]);
	});

});

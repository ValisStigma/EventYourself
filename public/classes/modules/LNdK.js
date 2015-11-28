define(['angular', 'routesConfig', 'ConfigService', 'EventsService', 'FeedbackService', 'navigationController', 'angularRoute'], function ( Angular, routesConfig, ConfigService, EventsService, FeedbackService, navigationController) {

	var LNdK = Angular.module('LNdK', ['ngRoute'])
		.controller('navigationController', navigationController)
		.factory('ConfigService', ConfigService)
		.factory('EventsService', EventsService)
		.factory('FeedbackService', FeedbackService);

	LNdK.config(routesConfig);

	return LNdK;
});


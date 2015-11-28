define(['angular', 'routesConfig', 'ConfigService', 'EventsService', 'FeedbackService', 'UserService', 'navigationController', 'angularRoute'],
	function ( Angular, routesConfig, ConfigService, EventsService, FeedbackService, UserService, navigationController) {

	var LNdK = Angular.module('LNdK', ['ngRoute'])
		.controller('navigationController', navigationController)
		.factory('ConfigService', ConfigService)
		.factory('EventsService', EventsService)
		.factory('UserService', UserService)
		.factory('FeedbackService', FeedbackService);

	LNdK.config(routesConfig);

	return LNdK;
});


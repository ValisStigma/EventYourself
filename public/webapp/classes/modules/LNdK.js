define(['angular', 'routesConfig', 'ConfigService', 'EventsService', 'FeedbackService', 'UserService', 'TagService', 'navigationController', 'angularRoute', 'angularCookies'],
	function ( Angular, routesConfig, ConfigService, EventsService, FeedbackService, UserService, TagService, navigationController) {

	var LNdK = Angular.module('LNdK', ['ngRoute', 'ngCookies'])
		.controller('navigationController', navigationController)
		.factory('ConfigService', ConfigService)
		.factory('EventsService', EventsService)
		.factory('UserService', UserService)
		.factory('TagService', TagService)
		.factory('FeedbackService', FeedbackService);

	LNdK.config(routesConfig);

	return LNdK;
});


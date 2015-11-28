define(['homeController', 'eventController', 'eventDetailController', 'feedbackController'],function(homeController, eventController, eventDetailController, feedbackController){
	'use strict';

	function config( $routeProvider, $locationProvider ) {

		$routeProvider
			.when('/', {
				templateUrl : 'pageTemplates/home.html',
				controller  : homeController,
				activetab: 'home'
			})

			.when('/events', {
				templateUrl : 'pageTemplates/events.html',
				controller  : eventController,
				activetab: 'events'
			})

			.when('/feedback', {
				templateUrl : 'pageTemplates/feedback.html',
				controller  : feedbackController,
				activetab: 'feedback'
			})

			.when('/eventDetail/:id', {
				templateUrl : 'pageTemplates/eventDetail.html',
				controller  : eventDetailController,
				activetab: 'eventDetail'
			})

			.otherwise({rederectTo: '/home'});

		//$locationProvider.html5Mode(true);
	}

	config.$inject=['$routeProvider', '$locationProvider'];

	return config;
});
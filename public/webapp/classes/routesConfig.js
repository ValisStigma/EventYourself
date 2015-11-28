define(['eventController', 'interestController' ,'eventDetailController', 'feedbackController'],function(eventController, interestController, eventDetailController, feedbackController){
	'use strict';

	function config( $routeProvider, $locationProvider ) {

		$routeProvider
			.when('/', {
				templateUrl : 'pageTemplates/events.html',
				controller  : eventController,
				activetab: 'events'
			})

			.when('/interests', {
				templateUrl : 'pageTemplates/interests.html',
				controller  : interestController,
				activetab: 'interest'
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
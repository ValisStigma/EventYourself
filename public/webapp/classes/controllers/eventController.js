define([], function( ){
	'use strict';

	function eventController( $scope, EventsService, ConfigService, UserService, $location ){

		/*if(UserService.isLoggedIn()) {
			$scope.interests = UserService.getInterests();
			EventsService.getAll().then(
				function( events ) { $scope.events = events;},
				function( error ) { $scope.errorMsg = error; $scope.isError = true;}
			);
		} else */
		if( UserService.isGuestWithInterests() || UserService.isLoggedIn()) {
			EventsService.getEventsByTagNames(UserService.getInterests())
				.then(function (events) { $scope.events = events.events; });
		} else {
			$location.path('interests');
		}

		$scope.logout = function () {
			UserService.logout();
			$location.path('interests');
		};

		$scope.getImagePath = ConfigService.basePathCreator('images/events');
	}

	eventController.$inject = ['$scope', 'EventsService', 'ConfigService', 'UserService', '$location'];

	return eventController;
});

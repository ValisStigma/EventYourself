define([], function( ){
	'use strict';

	function eventController( $scope, EventsService, ConfigService, UserService, $location, $cookies ){

		if(UserService.isLoggedIn()) {
			$scope.interests = UserService.getInterests();
			EventsService.getAll().then(
				function( events ) { $scope.events = events;},
				function( error ) { $scope.errorMsg = error; $scope.isError = true;}
			);
		} else if( UserService.isGuestWithInterests()) {
			EventsService.getEventsByTagNames($cookies.get('interests'))
				.then(function (events) { $scope.events = events; });
		} else {
			$location.path('interests');
		}


		$scope.getImagePath = ConfigService.basePathCreator('images/events');
	}

	eventController.$inject = ['$scope', 'EventsService', 'ConfigService', 'UserService', '$location', '$cookies'];

	return eventController;
});

define([], function( ){
	'use strict';

	function eventController( $scope, EventsService, ConfigService, UserService, $location, $cookies ){

		if(UserService.isLoggedIn() || UserService.isGuestWithInterests()) {
			console.log('attach intrests to scope');
			$scope.interests = EventsService.  //UserService.getInterests();
		} else {
			$location.path('interests');
		}

		EventsService.getAll().then(
			function( events ) { $scope.events = events;},
			function( error ) { $scope.errorMsg = error; $scope.isError = true;}
		);
		$scope.getImagePath = ConfigService.basePathCreator('images/events');
	}

	eventController.$inject = ['$scope', 'EventsService', 'ConfigService', 'UserService', '$location', '$cookies'];

	return eventController;
});

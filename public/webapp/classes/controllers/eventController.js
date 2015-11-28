define([], function( ){
	'use strict';

	function eventController( $scope, EventsService, ConfigService, UserService, $location, $cookies ){

		UserService.setUsername($cookies.get('username'));
		UserService.refreshInterests();

		if(UserService.hasInterests()) {
			$scope.interests = UserService.getInterests();
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

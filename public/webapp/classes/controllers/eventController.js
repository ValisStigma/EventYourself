define([], function( ){
	'use strict';

	function eventController( $scope, EventsService, ConfigService, UserService, $location ){

		if(UserService.isGuest()) {
			$location.path('interests');
		} else {
			$scope.interests = UserService.getInterests();
		}

		EventsService.getAll().then(
			function( events ) { $scope.events = events;},
			function( error ) { $scope.errorMsg = error; $scope.isError = true;}
		);
		$scope.getImagePath = ConfigService.basePathCreator('images/events');
	}

	eventController.$inject = ['$scope', 'EventsService', 'ConfigService', 'UserService', '$location'];

	return eventController;
});

define([], function( ){
	'use strict';

	function eventController( $scope, EventsService, ConfigService, UserService, $location, $cookies, $route ){

		if(UserService.isLoggedIn()) {
			$scope.interests = UserService.getInterests();
			EventsService.getAll().then(
				function( events ) { $scope.events = events;},
				function( error ) { $scope.errorMsg = error; $scope.isError = true;}
			);
		} else if( UserService.isGuestWithInterests()) {
			var interests = $cookies.get('interests');
			if(typeof interests == 'string') { interests = interests.split(','); }
			EventsService.getEventsByTagNames(interests)
				.then(function (events) {
					$scope.events = events.events;
				});
		} else {
			$location.path('interests');
		}

		$scope.logout = function () {
			UserService.logout();
			$location.path('interests');
		};

		$scope.getImagePath = ConfigService.basePathCreator('images/events');
	}

	eventController.$inject = ['$scope', 'EventsService', 'ConfigService', 'UserService', '$location', '$cookies', '$route'];

	return eventController;
});

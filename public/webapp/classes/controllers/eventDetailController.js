define([], function( ){
	'use strict';

	function eventDetailController( $scope, EventsService, $routeParams, ConfigService, $window, $route){
		$scope.commentSent = false;
		EventsService.getEventById($routeParams.id).then(
			function ( event ) {
				$scope.event = event;
			},
			function ( error ) { $scope.isError = true; $scope.errorMsg = error; }
		);

		$scope.getImagePath = ConfigService.basePathCreator('images/events');


		$scope.reset = function () {
			$route.reload();
		};

		// Adjust view scrolling
		$window.scrollTo(0, 0);

	}

	eventDetailController.$inject = [ '$scope', 'EventsService', '$routeParams', 'ConfigService', '$window', '$route'];

	return eventDetailController;
});

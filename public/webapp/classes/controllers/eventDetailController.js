define([], function( ){
	'use strict';

	function eventDetailController( $scope, EventsService, $routeParams, ConfigService, $window, $route){
		$scope.commentSent = false;
		EventsService.getEventById($routeParams.id).then(
			function ( event ) {
				$scope.event = event;
				EventsService.getComments($routeParams.id).then(
					function(comments) {
						if(comments && comments.length > 0) {
							$scope.event.comments = comments;
						}

					},
						function(error) {
							$scope.isError = true;
							$scope.errorMsg = error;}
				);
			},
			function ( error ) { $scope.isError = true; $scope.errorMsg = error; }
		);

		$scope.getImagePath = ConfigService.basePathCreator('images/events');
		$scope.comment = { author: '', msg: '' };
		$scope.submit = function ( ) {
			var author = $scope.comment.author,
					msg = $scope.comment.msg;

			if(msg.length == 0) return;

			EventsService.createComment($routeParams.id, {author: author, text: msg}).then(
				function ( comment ) {
					$scope.comment = {author: '', msg: ''};
					$scope.commentSent = true;
					$scope.event.comments.push(comment);
				},
				function ( error ) { console.log(error); }
			);
		};

		$scope.reset = function () {
			$route.reload();
		};

		// Adjust view scrolling
		$window.scrollTo(0, 0);

	}

	eventDetailController.$inject = [ '$scope', 'EventsService', '$routeParams', 'ConfigService', '$window', '$route'];

	return eventDetailController;
});

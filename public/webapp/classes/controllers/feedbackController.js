define([], function( ){
	'use strict';

	function feedbackController( $scope, FeedbackService, $route ){
		$scope.feedback = { author: '', msg: '' };
		$scope.message = "";
		var thankYouMessage = "Vielen Dank für dein Feedback.";
		$scope.submit = function ( ) {
			if($scope.feedback.msg.length == 0) return;

			FeedbackService.createFeedback({ author: $scope.feedback.author, text: $scope.feedback.msg }).then(
				function ( data ) { $scope.feedback = { author: '', msg: '' }; $scope.message = thankYouMessage },
				function ( error ) { console.log(error) }
			);
		};
		$scope.reset = function () {
			$route.reload();
		}
	}

	feedbackController.$inject = [ '$scope', 'FeedbackService', '$route' ];

	return feedbackController;
});

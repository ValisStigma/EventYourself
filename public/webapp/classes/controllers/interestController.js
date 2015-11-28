define([], function( ){
	'use strict';

	function interestController( $scope, UserService ){
		$scope.message = "Tell us interests"

		$scope.login = function () {
			alert('login');
		};

		$scope.register = function () {
			var user = {
				username: 'user1',
				password: 'pass1'
			};
			UserService.registerUser(user);
		};
	}



	interestController.$inject = [ '$scope', 'UserService' ];

	return interestController;
});

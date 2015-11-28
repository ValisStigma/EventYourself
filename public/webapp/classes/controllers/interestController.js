define([], function( ){
	'use strict';

	function interestController( $scope, UserService, TagsService ){
		$scope.message = "Tell us interests";

		$scope.login = function () {
			alert('login');
		};

		TagsService.getAll().then(
				function( tags ) { $scope.tags = tags;},
				function( error ) { $scope.errorMsg = error; $scope.isError = true;}
		);

		$scope.register = function () {
			var user = {
				username: 'user1',
				password: 'pass1'
			};
			UserService.registerUser(user);
		};
	}



	interestController.$inject = [ '$scope', 'UserService' , 'TagsService'];

	return interestController;
});

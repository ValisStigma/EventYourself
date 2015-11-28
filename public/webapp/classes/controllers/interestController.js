define([], function( ){
	'use strict';

	function interestController( $scope, UserService ){
		$scope.selectedInterests = [];

		var interestAlreadySelected = function( id ) {
			return $scope.selectedInterests.indexOf(id) >= 0;
		};

		$scope.addInterest = function ( id ) {
			if(!interestAlreadySelected(id)) {
				$scope.selectedInterests.push(id);
			}
		};

		$scope.removeInterest = function ( id ) {
			if(interestAlreadySelected(id)) {
				array.splice($scope.selectedInterests.indexOf(id), 1);
			}
		};

		$scope.login = function () {
			var credentials = {
				username: $scope.username,
				password: $scope.password
			};
			UserService.login( credentials ).then(function( msg ) {
				alert(msg)
			}, function (msg) {
				alert(msg)
			});
		};

		$scope.register = function () {
			var user = {
				username: $scope.username,
				password: $scope.password
			};

			UserService.registerUser(user).then(function( msg ) {
				alert(msg);
				$scope.login();
			}, function (msg) {
				alert(msg)
			});


		};
	}



	interestController.$inject = [ '$scope', 'UserService' ];

	return interestController;
});

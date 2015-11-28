define([], function( ){
	'use strict';

	function interestController( $scope, UserService, TagService ){
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

		TagsService.getAll().then(
				function( tags ) { $scope.tags = tags;},
				function( error ) { $scope.errorMsg = error; $scope.isError = true;}
		);

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



	interestController.$inject = [ '$scope', 'UserService' , 'TagsService'];

	return interestController;
});

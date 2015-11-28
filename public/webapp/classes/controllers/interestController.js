define([], function( ){
	'use strict';

	function interestController( $scope, UserService, TagService ){
		$scope.selectedInterests = [];

		var interestAlreadySelected = function( id ) {
			return $scope.selectedInterests.indexOf(id) >= 0;
		};

		var addInterest = function ( id ) {
			if(!interestAlreadySelected(id)) {
				$scope.selectedInterests.push(id);
			}
		};

		var removeInterest = function ( id ) {
			if(interestAlreadySelected(id)) {
				$scope.selectedInterests.splice($scope.selectedInterests.indexOf(id), 1);
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

		$scope.tagIsSelected = function ( id ) {
			return interestAlreadySelected(id) ? 'selected' : '';
		};

		$scope.toggleTagSelection = function ( id ) {
			if(interestAlreadySelected(id)) {
				removeInterest(id);
			} else {
				addInterest(id);
			}
		};

		TagService.getAll().then(
				function( tags ) { $scope.tags = tags;},
				function( error ) { $scope.errorMsg = error; $scope.isError = true;}
		);

		$scope.register = function () {
			var user = {
				username: $scope.username,
				password: $scope.password,
				interests: $scope.selectedInterests
			};

			UserService.registerUser(user).then(function( msg ) {
				alert(msg);
				$scope.login();
			}, function (msg) {
				alert(msg)
			});


		};
		$scope.enableLogin = function() {
			$scope.loginActive = true;
		};
		$scope.enableRegistration = function() {
			$scope.registrationActive = true;
		};

		$scope.goToEvents = function ( forced ) {
			if(forced) {
				UserService.setInterests($scope.interests);
				$location('events');
			}

			if(UserService.isGuest()) {
				$scope.showRegisterForm = true;
				console.log('hhu')
			}
		};
	}



	interestController.$inject = [ '$scope', 'UserService' , 'TagService'];

	return interestController;
});

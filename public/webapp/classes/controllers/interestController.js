define([], function( ){
	'use strict';

	function interestController( $scope, UserService, TagService, $location, $cookies ){
		$scope.selectedInterests = [];
		$scope.loginFormError = false;
		$scope.registerFormError = false;
		$scope.userAlreadyExistError = false;
		$scope.invalidCredentials = false;

		var interestAlreadySelected = function( id ) { return $scope.selectedInterests.indexOf(id) >= 0; };

		var addInterest = function ( id ) { $scope.selectedInterests.push(id); };

		var removeInterest = function ( id ) { $scope.selectedInterests.splice($scope.selectedInterests.indexOf(id), 1); };

		$scope.login = function () {
			var credentials = {
				username: $scope.username,
				password: $scope.password
			};

			if(!credentials.username || !credentials.password) {
				$scope.loginFormError = true;
				return;
			}

			UserService.login( credentials ).then(function( data ) {
				UserService.setUsername($scope.username);
				$location.path('/');
			}, function (  ) {
				$scope.invalidCredentials = true;
			});
		};

		$scope.tagIsSelected = function ( id ) { return interestAlreadySelected(id) ? 'selected' : ''; };

		$scope.toggleTagSelection = function ( id ) {
			/*if(typeof $scope.selectedInterests == 'string') {
				$scope.selectedInterests = $scope.selectedInterests.split(',');
			}*/

			if(interestAlreadySelected(id)) {
				removeInterest(id);
			} else {
				addInterest(id);
			}
		};

		$scope.register = function () {
			var user = {
				username: $scope.username,
				password: $scope.password,
				interests: $scope.selectedInterests
			};

			if(!user.username || !user.password || !user.interests) {
				$scope.registerFormError = true;
				return;
			}

			UserService.registerUser(user).then($scope.login, function ( ) { $scope.userAlreadyExistError = true; });
		};

		$scope.enableLogin = function() {
			$scope.loginActive = true;
			$scope.registrationActive = false;
		};

		$scope.enableRegistration = function() {
			$scope.registrationActive = true;
			$scope.loginActive = false;
		};

		$scope.goToEvents = function ( forced ) {
			if($scope.noTagSelected()) return;

			if(forced) {
				UserService.setInterests($scope.selectedInterests);
				UserService.updateUser();
				$location.path('/');
			}

			if(UserService.isGuest()) {
				$scope.loginActive = false;
				$scope.registrationActive = true;
			}
		};

		$scope.logout = function () {
			UserService.logout();
			$location.path('/');
		};

		$scope.isLoggedIn = function () { return UserService.isLoggedIn(); };
		$scope.noTagSelected = function () { return $scope.selectedInterests.length == 0; };
		$scope.forceToEventsFlag = function () { return $scope.isLoggedIn() == 0 };

		var init = function () {
			TagService.getAll().then(
				function( tags ) { $scope.tags = tags;},
				function( error ) { $scope.errorMsg = error; $scope.isError = true;}
			);

			if($scope.isLoggedIn()) { $scope.selectedInterests = UserService.getInterests(); }

		};

		init();
	}



	interestController.$inject = [ '$scope', 'UserService' , 'TagService', '$location', '$cookies'];

	return interestController;
});

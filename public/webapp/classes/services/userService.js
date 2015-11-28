define([], function(){
	'use strict';

	var userService = function($http, ConfigService, $q ) {
		Array.prototype.isEmpty = function () { return this.length == 0; };

		var username = null,
			interests = [],
			getAPI_URL = ConfigService.requestUrlCreator('api/auth');

		var isLoggedIn = function ( ) {
			return username != null;
		};

		var registerUser = function( user ) {
			// user = { username: 'testname', password: 'pass' }
			$http.put(getAPI_URL('register'), user, function() {
				console.log('registered')
			});
		};

		var login = function ( credentials ) {
			$http.post(getAPI_URL('login'), credentials, function ( user ) {
				console.log(user);
			})
		};

		var getInterests = function () {
			return interests;
		};


		var isGuest = function () { return !isLoggedIn() };

		return { isLoggedIn: isLoggedIn, isGuest: isGuest, login: login, registerUser: registerUser, getInterests: getInterests }
	};

	userService.$inject = [ '$http', 'ConfigService', '$q'];

	return userService;
});

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

		var hasInterests = function () { return interests.length > 0; };

		var setInterests = function ( interests ) {
			this.interests = interests;
		};

		var getInterests = function () {
			return interests;
		};

		var getUsername = function () {
			return username;
		};

		var registerUser = function( user ) {
			var def = $q.defer();

			$http.put(getAPI_URL('register'), user)
				.success( function() {
					def.resolve('passd')
				})
				.error(function() { def.reject('err') });

			return def.promise;
		};

		var login = function ( credentials ) {
			var def = $q.defer();

			$http.post(getAPI_URL('login'), credentials)
				.success( function ( user ) {
					interests = user.interests;
					username = user.username;
					def.resolve('pass')
				})
				.error( function() { def.reject('err') });

			return def.promise;

		};



		var isGuest = function () { return !isLoggedIn() };

		return { isLoggedIn: isLoggedIn, isGuest: isGuest, login: login, registerUser: registerUser, getInterests: getInterests, hasInterests: hasInterests, setInterests: setInterests }
	};

	userService.$inject = [ '$http', 'ConfigService', '$q'];

	return userService;
});

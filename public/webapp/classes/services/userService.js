define([], function(){
	'use strict';

	var userService = function($http, ConfigService, $q, $cookies ) {
		Array.prototype.isEmpty = function () { return this.length == 0; };

		var username = null,
			interests = [],
			getAPI_URL = ConfigService.requestUrlCreator('api/auth');

		var isLoggedIn = function ( ) {
			return $cookies.get('username') != null;
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

		var setUsername = function ( username ) {
			this.username = username;
		};

		var refreshInterests = function () {
			var def = $q.defer();

			if(isLoggedIn()) {
				$http.get(getAPI_URL('interests'))
					.success( function ( data ) { console.log(data); def.resolve(); } )
					.error( function () { def.refuse(); } )
			}


			return def.promise;
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
					console.log("user:");
					console.log(user);
					interests = user.interests;
					username = user.username;
					def.resolve('pass')
				})
				.error( function() { def.reject('err') });

			return def.promise;
		};



		var isGuest = function () { return !isLoggedIn() };

		return { isLoggedIn: isLoggedIn, isGuest: isGuest, login: login, registerUser: registerUser, getInterests: getInterests, hasInterests: hasInterests, setInterests: setInterests, setUsername: setUsername, getUsername: getUsername, refreshInterests: refreshInterests}
	};

	userService.$inject = [ '$http', 'ConfigService', '$q', '$cookies'];

	return userService;
});

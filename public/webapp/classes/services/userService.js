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
			if(isLoggedIn()) return $cookies.get('interests');
			return null;
		};

		var getUsername = function () {
			if(isLoggedIn()) return $cookies.get('username');
			return null;
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
					$cookies.put('username', username);
					$cookies.put('interests', interests);
					def.resolve('pass')
				})
				.error( function() { def.reject('err') });

			return def.promise;
		};

		var logout = function () {
			$cookies.remove('interests');
			$cookies.remove('username');
			interests = [];
			username = null;
		};

		var isGuest = function () { return !isLoggedIn() };
		var isGuestWithInterests = function () { return !$cookies.get('username') && $cookies.get('interests') };


		return { isLoggedIn: isLoggedIn, isGuest: isGuest, login: login, registerUser: registerUser, getInterests: getInterests, hasInterests: hasInterests, setInterests: setInterests, setUsername: setUsername, getUsername: getUsername, refreshInterests: refreshInterests, isGuestWithInterests: isGuestWithInterests, logout:logout}
	};

	userService.$inject = [ '$http', 'ConfigService', '$q', '$cookies'];

	return userService;
});

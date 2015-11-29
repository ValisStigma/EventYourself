define([], function(){
	'use strict';

	var userService = function($http, ConfigService, $q, $cookies ) {
		Array.prototype.isEmpty = function () { return this.length == 0; };

		var getAPI_URL = ConfigService.requestUrlCreator('api/user');

		var isLoggedIn = function ( ) { return $cookies.get('username') != null; };

		var setInterests = function ( interests ) { $cookies.put('interests', interests); };

		var getInterests = function () {
			var interests = $cookies.get('interests');
			return interests ? interests.split(',') : null;
		};

		var getUsername = function () { return $cookies.get('username'); };

		var setUsername = function ( username ) { $cookies.put('username', username); };

		var registerUser = function( user ) {
			var def = $q.defer();

			$http.put(getAPI_URL('register'), user)
				.success( function ( data ) { def.resolve( data ); })
				.error(function ( data ) { def.reject( data ) });

			return def.promise;
		};

		var login = function ( credentials ) {
			var def = $q.defer();

			$http.post(getAPI_URL('login'), credentials)
				.success( function ( user ) {
					setInterests(user.interests);
					setUsername(user.username);
					def.resolve( user );
				})
				.error( function ( data ) { def.reject( data ) });

			return def.promise;
		};

		var logout = function () {
			$cookies.remove('interests');
			$cookies.remove('username');
		};

		var updateUser = function () {
			var def = $q.defer();
			if(!isLoggedIn()) {
				def.reject('not logged in');
				return def.promise;
			}
			var user = {
				username: getUsername(),
				interests: getInterests()
			};

			$http.post(getAPI_URL('update'), user)
				.success(function ( data ) { def.resolve( data ); })
				.error(function ( data ) { def.reject( data ); });

			return def.promise;
		};
		var isGuest = function () { return !isLoggedIn() };
		var isGuestWithInterests = function () { return !getUsername() && getInterests() };


		return { isLoggedIn: isLoggedIn, isGuest: isGuest, login: login, registerUser: registerUser, getInterests: getInterests, setInterests: setInterests, setUsername: setUsername, getUsername: getUsername, isGuestWithInterests: isGuestWithInterests, logout:logout, updateUser: updateUser}
	};

	userService.$inject = [ '$http', 'ConfigService', '$q', '$cookies'];

	return userService;
});

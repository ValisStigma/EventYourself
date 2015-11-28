define([], function(){
	'use strict';

	var feedbackService = function($http, ConfigService, $q) {
		var getApiUrl = ConfigService.requestUrlCreator('api');

		var createFeedback = function ( feedback ) {
			var def = $q.defer();

			$http.post(getApiUrl('feedback'), feedback).then(
				function ( data ) { def.resolve(data); },
				function ( error ) { def.reject(error); }
			);

			return def.promise;
		};

		return { createFeedback: createFeedback }
	};

	feedbackService.$inject = [ '$http', 'ConfigService', '$q' ];

	return feedbackService;
});

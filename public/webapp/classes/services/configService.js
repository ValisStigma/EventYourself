define([], function(){
	'use strict';

	var configService = function() {
		var constant = {
				path: {assetsPath: 'assets/'},
				url: {api: "api", base: "http://localhost:5000/"},
				assetDirs: {img: 'images'}
			},
			basePathCreator = function ( directory ) {
				return function ( filename ) { return constant.path.assetsPath + directory + '/' + filename; };
			},
			requestsUrlCreator = function ( base ) {
				return function ( requestURL ) { return constant.url.base + base + '/' + requestURL; }
			};

		var getConstants = function () { return constant; };

		return { constants: getConstants(), basePathCreator: basePathCreator, requestUrlCreator: requestsUrlCreator }
	};

	return configService;
});

define([], function(){
	'use strict';

	var configService = function() {
		var constant = {
				path: {assetsPath: 'assets/'},
				url: {api: "api", base: "http://152.96.234.165:8080/"},
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

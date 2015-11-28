define([], function( ){
	'use strict';

	function homeController($scope, ConfigService){

		$scope.getImagePath = ConfigService.basePathCreator('images');
	}

	homeController.$inject = [ '$scope', 'ConfigService'];

	return homeController;
});

define([], function( ){
	'use strict';

	function navigationController( $scope, ConfigService, $location ){

		$scope.toggleMenu = function () { $scope.navMenuIsOpen = !$scope.navMenuIsOpen; };
		$scope.getImagePath = ConfigService.basePathCreator('images');

		$scope.setActivePage = function ( pageID ) {
			$scope.activetab = pageID;
		};
		$scope.setActivePage($location.$$path);


	}

	navigationController.$inject = ['$scope', 'ConfigService', '$location'];

	return navigationController;
});

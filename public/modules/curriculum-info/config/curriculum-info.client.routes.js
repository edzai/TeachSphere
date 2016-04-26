'use strict';

//Setting up route
angular.module('curriculum-info').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('select', {
			url: '/select',
			controller: 'SelectController',
			templateUrl: 'modules/curriculum-info/views/select.client.view.html'
		});
	}
]);

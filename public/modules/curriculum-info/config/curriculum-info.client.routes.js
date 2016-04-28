'use strict';

//Setting up route
angular.module('curriculum-info').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('curriculum', {
			url: '/curriculum',
			controller: 'CurriculumController',
			templateUrl: 'modules/curriculum-info/views/curriculum.client.view.html'
		}).
		state('select', {
			url: '/select',
			controller: 'SelectController',
			templateUrl: 'modules/curriculum-info/views/select.client.view.html'
		});
	}
]);

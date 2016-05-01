'use strict';

angular.module('curriculum-info').controller('CurriculumDataController', ['$scope', '$location',
	function($scope, $location) {

		// get curriculum topic details and comments
		$scope.getCurriculumTopicData = function() {
			var id = $location.search().id;

		};
	}
]);

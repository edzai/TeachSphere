'use strict';

angular.module('curriculum-info').controller('CurriculumController', ['$scope', '$location', 'CurriculumService',
	function($scope, $location, CurriculumService) {
		var queryParams = $location.search();
		$scope.curriculumData = CurriculumService.get({ grade: queryParams.grade, subject: queryParams.subject });
	}
]);

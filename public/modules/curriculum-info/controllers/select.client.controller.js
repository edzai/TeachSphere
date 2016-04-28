'use strict';

angular.module('curriculum-info').controller('SelectController', ['$scope', '$location', 'CurriculumService', 'GradesService', 'SubjectsService',
	function($scope, $location, CurriculumService, GradesService, SubjectsService) {
		$scope.formSubmit = function() {
			$location.path('/curriculum').search({ grade: $scope.grade, subject: $scope.subject });
		};

		// retrieves and renders grades list
		$scope.getGrades = function() {
			GradesService
			.query()
			.$promise
			.then(function(data) {
				$scope.grades = data;
			});
		};

		// retrieves subjects for selected grade
		$scope.gradeSelected = function() {
			SubjectsService
			.query({ grade: $scope.grade })
			.$promise
			.then(function(data) {
				$scope.subjects = data;
			});
		};
	}
]);

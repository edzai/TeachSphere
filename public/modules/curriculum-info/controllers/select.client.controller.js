'use strict';

angular.module('curriculum-info').controller('SelectController', ['$scope', 'CurriculumService', 'GradesService', 'SubjectsService',
	function($scope, CurriculumService, GradesService, SubjectsService) {

		// TODO: retrieves and renders data using grade & subject
		$scope.formSubmit = function() {
			CurriculumService
			.get({ grade: $scope.grade, subject: $scope.subject })
			.$promise
			.then(function(data) {
				console.log(JSON.stringify(data));
			});
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

		$scope.gradeSelected = function() {
			SubjectsService
			.query({ grade: $scope.grade })
			.$promise
			.then(function(data) {
				$scope.subjects = data;
			});
		}
	}
]);

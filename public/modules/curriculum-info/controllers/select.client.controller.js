'use strict';

angular.module('curriculum-info').controller('SelectController', ['$scope', '$location', 'CurriculumService', 'GradesService', 'SubjectsService',
	function($scope, $location, CurriculumService, GradesService, SubjectsService) {

		$scope.goButtonStyle = { color: 'white', 'background-color': 'black', border: '2px solid black' };

		$scope.init = function() {

			// disable all elements initially
			$scope.shouldDisableGrades = true;
			$scope.shouldDisableSubjects = true;
			$scope.shouldDisableSubmit = true;

			// retrieves and renders grades list
			GradesService
			.query()
			.$promise
			.then(function(data) {
				$scope.grades = data;
				$scope.shouldDisableGrades = false;
			});
		};

		/* retrieves subjects for selected grade */
		$scope.gradeSelected = function() {
			SubjectsService
			.query({ grade: $scope.grade })
			.$promise
			.then(function(data) {
				$scope.subjects = data;
				$scope.shouldDisableSubjects = false;
			});
		};

		/* enable submit button when subject selected */
		$scope.subjectSelected = function() {
			$scope.shouldDisableSubmit = false;
		};

		/* handles submission of form */
		$scope.formSubmit = function() {
			$location.path('/curriculum').search({ grade: $scope.grade, subject: $scope.subject });
		};

		/* change go button style when mouse enters it */
		$scope.goButtonMouseOver = function() {
			$scope.goButtonStyle = { color: 'black', 'background-color': 'white', border: '2px solid black' };
		};

		/* change go button style when mouse leaves it */
		$scope.goButtonMouseLeave = function() {
			$scope.goButtonStyle = { color: 'white', 'background-color': 'black', border: '2px solid black' };
		};
	}
]);

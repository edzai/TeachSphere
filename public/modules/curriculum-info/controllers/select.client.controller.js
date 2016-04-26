'use strict';

angular.module('curriculum-info').controller('SelectController', ['$scope', 'CurriculumService', 'GradesService',
	function($scope, CurriculumService, GradesService) {

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
	}
]);

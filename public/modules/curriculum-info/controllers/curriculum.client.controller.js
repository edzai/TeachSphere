'use strict';

angular.module('curriculum-info').controller('CurriculumController', ['$scope', '$location', '$sce', 'CurriculumService',
	function($scope, $location, $sce, CurriculumService) {
		var queryParams = $location.search(),
				grade = queryParams.grade,
				subject = queryParams.subject;
		$scope.curriculumData = CurriculumService.get({ grade: grade, subject: subject });

		var gradeAndSubjectHtml = '<b>Grade: </b>' +	grade + '<br>' +
															'<b>Subject: </b>' + subject + '<br>';

		// displays popover for element mouse is currently in
		$scope.showElementData = function(title, description) {
			var titleAndDescriptionHtml = '<b>Section: </b>' +	title + '<br>';
			$scope.popoverHtml = $sce.trustAsHtml(gradeAndSubjectHtml + titleAndDescriptionHtml);
		}
	}
]);

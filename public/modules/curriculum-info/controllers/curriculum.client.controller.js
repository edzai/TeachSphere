'use strict';

angular.module('curriculum-info').controller('CurriculumController', ['$scope', '$location', '$sce', '$anchorScroll', 'CurriculumService',
	function($scope, $location, $sce, $anchorScroll, CurriculumService) {

		/* get curriculum data */
		$scope.init = function() {
			$scope.hideContents = true;
			$scope.grade = $location.search().grade;
			$scope.subject = $location.search().subject;
			CurriculumService
				.get({ grade: $scope.grade, subject: $scope.subject  })
				.$promise
				.then(function(data) {
					$scope.curriculumData = data;
					$scope.hideContents = false;
				});
		};

		var gradeAndSubjectHtml = '<b>Grade: </b>' +	$scope.grade + '<br>' +
															'<b>Subject: </b>' + $scope.subject  + '<br>';

		/* displays popover for element mouse is currently in */
		$scope.showElementData = function(title, rating) {
			var sectionHtml = '<b id="section">Section: </b>' +	title + '<br>';

			// build HTML for easiness bar
			var easinessBarHtml = '<div id="easiness-bar-container" class="container-fluid"> \
															<div class="row"> \
																<b id="easiness-bar-label" class="col-sm-1">Easy: </b> \
																<div id="progress-div" class="progress"> \
																	<div class="progress-bar progress-bar-success" style="width:' + rating + '%">' +
    																rating + '% \
  																</div> \
														 		</div> \
															</div> \
														</div>';
			var popoverHtml = gradeAndSubjectHtml + sectionHtml + easinessBarHtml;
			$scope.popoverHtml = $sce.trustAsHtml(popoverHtml);
		};

		/* navigates to appropriate header based on user click */
		$scope.navigateTo = function(id) {
			$location.hash(id);
			$anchorScroll();
		};

		/* go to curriculum data page */
		$scope.viewMore = function(id) {
			$location.path('/curriculum/data').search({ id: id });
		};
	}
]);

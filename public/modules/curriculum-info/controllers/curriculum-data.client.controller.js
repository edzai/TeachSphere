'use strict';

angular.module('curriculum-info').controller('CurriculumDataController', ['$scope', '$location', '$uibModal', 'CurriculumCommentService',
	function($scope, $location, $uibModal, CurriculumCommentService) {

		/* TODO: get curriculum topic details and comments */
		$scope.getCurriculumTopicData = function() {
			$scope.id = $location.search().id;
		};

		/* displays add comment modal and saves comment */
		$scope.addComment = function() {
			$uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'commentModal.html',
				controller: 'CommentModalController'
			}).result.then(
				function(response) {
					response.id = $scope.id;
					CurriculumCommentService
					.save(response)
					.$promise
					.then(function(data) {
						// TODO: handle comment UI
					}, function(err) {
						// TODO: handle comment error
					});
			});
		};
	}
]);

angular.module('curriculum-info').controller('CommentModalController', ['$scope', '$uibModalInstance',
	function ($scope, $uibModalInstance) {

		/* constants */
		$scope.RATINGS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		/* returns modal data */
		$scope.add = function() {
			$uibModalInstance.close({ rating: $scope.rating,
																difficultAreas: $scope.difficultAreas,
																techniques: $scope.techniques,
																date: new Date() });
		};

		/* closes modal */
		$scope.cancel = function() {
			$uibModalInstance.dismiss();
		};

		/* clears all modal fields */
		$scope.reset = function() {
			$scope.rating = $scope.difficultAreas = $scope.techniques = '';
		};
	}
]);

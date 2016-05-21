'use strict';

angular.module('curriculum-info').controller('CurriculumDataController', ['$scope', '$location', '$uibModal', 'CurriculumCommentService', 'CurriculumTopicService',
	function($scope, $location, $uibModal, CurriculumCommentService, CurriculumTopicService) {

		/* get curriculum topic details and comments */
		$scope.getCurriculumTopicData = function() {
			$scope.id = $location.search().id;
			CurriculumTopicService
			.get({ id: $scope.id })
			.$promise
			.then(function(data) {
				$scope.data = data;
			 });
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
						// retrieve updated curriculum data
						$scope.getCurriculumTopicData();
					}, function(err) {
						console.error('Unable to save comment: ' + err);
					});
			});
		};
	}
]);

angular.module('curriculum-info').controller('CommentModalController', ['$scope', '$uibModalInstance',
	function ($scope, $uibModalInstance) {

		/* constants */
		$scope.RATINGS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		$scope.ratingStyling = $scope.difficultAreasStyling = $scope.techniquesStyling = { border: '1px solid gray' };

		/* returns modal data */
		$scope.add = function() {

			// all fields of comment modal must be filled
			var allFieldsFilled = true;
			if(! $scope.rating) {
				$scope.ratingStyling = { border: '1px solid red' };
				allFieldsFilled = false;
			}
			if(! $scope.difficultAreas) {
				$scope.difficultAreasStyling = { border: '1px solid red' };
				allFieldsFilled = false;
			}
			if(! $scope.techniques) {
				$scope.techniquesStyling = { border: '1px solid red' };
				allFieldsFilled = false;
			}
			if(allFieldsFilled) {
				$uibModalInstance.close({ rating: $scope.rating,
																	difficultAreas: $scope.difficultAreas,
																	techniques: $scope.techniques,
																	date: new Date().toLocaleString() });
			}
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

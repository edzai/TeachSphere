'use strict';

angular.module('curriculum-info').factory('CurriculumService', ['$resource',
	function($resource) {
		return $resource('/curriculum');
	}
]);

angular.module('curriculum-info').factory('GradesService', ['$resource',
	function($resource) {
		return $resource('/grades');
	}
]);

angular.module('curriculum-info').factory('SubjectsService', ['$resource',
	function($resource) {
		return $resource('/subjects');
	}
]);

angular.module('curriculum-info').factory('CurriculumTopicService', ['$resource',
	function($resource) {
		return $resource('/curriculum/topic');
	}
]);

angular.module('curriculum-info').factory('CurriculumCommentService', ['$resource',
	function($resource) {
		return $resource('/curriculum/comment');
	}
]);

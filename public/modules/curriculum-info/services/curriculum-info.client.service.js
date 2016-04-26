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

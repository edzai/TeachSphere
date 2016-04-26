'use strict';

var curriculumInfoController = require('../controllers/curriculum-info.server.controller.js');

module.exports = function(app) {
	app.route('/curriculum').get(curriculumInfoController.getCurriculumInfo);
	app.route('/grades').get(curriculumInfoController.getGrades);
	app.route('/subjects').get(curriculumInfoController.getSubjects);
};
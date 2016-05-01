'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	CurriculumTopic = mongoose.model('CurriculumTopic');

/**
 * Globals
 */
var user, curriculumTopic;

/**
 * Unit tests
 */
describe('Curriculum topic Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			curriculumTopic = new CurriculumTopic({
				// Add model fields
				// ...
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return curriculumTopic.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		CurriculumTopic.remove().exec();
		User.remove().exec();

		done();
	});
});
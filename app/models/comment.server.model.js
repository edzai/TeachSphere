'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	difficulty: {
		type: Number,
		min: 0,
		max: 10,
		required: 'Must specifiy difficulty'
	},
	description: {
		type: String,
		required: 'Must specify description',
		trim: true
	},
	suggestion: {
		type: String,
		required: 'Must specify suggestion',
		trim: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Comment', CommentSchema);

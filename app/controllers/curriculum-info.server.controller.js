'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    querystring = require('querystring'),
    request = require('request');

/* constants */
var CURRICULUM_INFO_ENDPOINT = 'https://elastic1.asn.desire2learn.com/api/1/search';
var ASN_API_KEY = null;
var BQ_PREFIX = "?bq=(and+jurisdiction:'Ontario'+publication_status:'Published'+has_child:'false'";

exports.getCurriculumInfo = function(req, res) {
  // curriculum info retrieval data
  var data = {
    key: ASN_API_KEY,
    size: 200,
    'return-fields': 'description,education_level'
  }

  // build bq query param and url
  var bq = BQ_PREFIX + "+education_level:'" + req.query.grade + "'+subject:'" + req.query.subject + "')&";
  var url = CURRICULUM_INFO_ENDPOINT + bq + querystring.stringify(data);

  // retrieve curriculum info for grade and subject
  request(url, function (error, response, body) {
    if (! error && response.statusCode === 200) {
      res.json(JSON.parse(body));
    }
  });
};

exports.getGrades = function(req, res) {
  // education levels retrieval data
  var data = {
    key: ASN_API_KEY,
    size: 0,  // specify as zero since only need education levels
    facet: 'fct_education_level'
  }

  // build bq query param and url
  var bq = BQ_PREFIX + ')&';
  var url = CURRICULUM_INFO_ENDPOINT + bq + querystring.stringify(data);

  // retrieve list of education levels
  request(url, function (error, response, body) {
    if (! error && response.statusCode === 200) {
      var constraints = JSON.parse(body)['facets']['fct_education_level']['constraints'];
      var grades = [];
      for (var i = constraints.length - 1; i >= 0; i--) {
        grades.push(constraints[i].value);
      }
      res.send(grades);
    }
  });
};

exports.getSubjects = function(req, res) {
  // subjects retrieval data
  var data = {
    key: ASN_API_KEY,
    size: 0,  // specify as zero since only need subjects
    facet: 'fct_subject'
  }

  // build bq query param and url
  var bq = BQ_PREFIX + "+education_level:'" + req.query.grade + "')&";
  var url = CURRICULUM_INFO_ENDPOINT + bq + querystring.stringify(data);

  // retrieve list of subjects
  request(url, function (error, response, body) {
    if (! error && response.statusCode === 200) {
      var constraints = JSON.parse(body)['facets']['fct_subject']['constraints'];
      var len = constraints.length;
      var subjects = new Array(len);
      for (var i = 0; i < len; i++) {
        subjects[i] = constraints[i].value;
      }
      res.send(subjects);
    }
  });
};

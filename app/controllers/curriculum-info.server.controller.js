'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    querystring = require('querystring'),
    request = require('request');

/* constants */
var CURRICULUM_INFO_ENDPOINT = 'https://elastic1.asn.desire2learn.com/api/1/search',
    ASN_API_KEY = null,
    BQ_PREFIX = "?bq=(and+jurisdiction:'Ontario'+publication_status:'Published'+has_child:'false'+type:'Statement'";

exports.getCurriculumData = function(req, res) {
  // curriculum info retrieval data
  var data = {
    key: ASN_API_KEY,
    size: 1000,
    rank: 'description',
    'return-fields': 'description,education_level'
  };

  // build bq query param and url
  var bq = BQ_PREFIX + "+education_level:'" + req.query.grade + "'+subject:'" + req.query.subject + "')&",
      url = CURRICULUM_INFO_ENDPOINT + bq + querystring.stringify(data);

  // retrieve curriculum info for grade and subject
  request(url, function (error, response, body) {
    if (! error && response.statusCode === 200) {
      var currRawData = JSON.parse(body).hits.hit,
          currRefinedData = {};
      currRawData.forEach(function(element) {
        var data = element.data,
            description = data.description.slice(1),
            title = data.description[0];

        // create key-value for subject title if DNE
        if(! currRefinedData[title]) {
          currRefinedData[title] = [];
        }

        // only use descriptions specific to one grade
        if(data.education_level.length === 1) {
          description.forEach(function(element) {

            // only include unique descriptions for subject
            if(currRefinedData[title].indexOf(element) === -1) {
              currRefinedData[title].push(element);
            }
          });
        }
      });

      // remove all curriculum topics which have no description
      for(var key in currRefinedData) {
        if(! currRefinedData[key].length) {
          delete currRefinedData[key];
        }
      }
      res.send(currRefinedData);
    }
  });
};

exports.getGrades = function(req, res) {
  // education levels retrieval data
  var data = {
    key: ASN_API_KEY,
    size: 0,  // specify as zero since only need education levels
    facet: 'fct_education_level'
  };

  // build bq query param and url
  var bq = BQ_PREFIX + ')&',
      url = CURRICULUM_INFO_ENDPOINT + bq + querystring.stringify(data);

  // retrieve list of education levels
  request(url, function (error, response, body) {
    if (! error && response.statusCode === 200) {
      var constraints = JSON.parse(body).facets.fct_education_level.constraints,
          grades = [];
      constraints.forEach(function(element) {
        grades.push(element.value);
      });
      res.send(grades);
    }
  });
};

exports.getSubjects = function(req, res) {
  // subjects retrieval data
  var data = {
    key: ASN_API_KEY,
    size: 0,  // specify as zero since only need subjects
    facet: 'fct_subject',
    'facet-fct_subject-sort': 'alpha'
  };

  // build bq query param and url
  var bq = BQ_PREFIX + "+education_level:'" + req.query.grade + "')&",
      url = CURRICULUM_INFO_ENDPOINT + bq + querystring.stringify(data);

  // retrieve list of subjects
  request(url, function (error, response, body) {
    if (! error && response.statusCode === 200) {
      var constraints = JSON.parse(body).facets.fct_subject.constraints,
          subjects = [];
      constraints.forEach(function(element) {
        subjects.push(element.value);
      });
      res.send(subjects);
    }
  });
};

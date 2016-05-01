'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    querystring = require('querystring'),
    request = require('request'),
    hash = require('object-hash'),
    mongodb = require('mongodb').MongoClient,
    errorHandler = require('./errors.server.controller'),
    CurriculumTopic = mongoose.model('CurriculumTopic'),
    async = require('async');

/* constants */
var CURRICULUM_INFO_ENDPOINT = 'https://elastic1.asn.desire2learn.com/api/1/search',
    ASN_API_KEY = null,
    BQ_PREFIX = "?bq=(and+jurisdiction:'Ontario'+publication_status:'Published'+has_child:'false'+type:'Statement'";

/*
 * helper classes
 */

/* set of objects with unique ids */
var IdSet = function() {
    this.ids = new Set();   // set of ids
    this.list = [];   // array of objects corresponding to ids

    // adds item only if no existing object with identical id exists
    this.add = function(item) {
      if(! item || ! item.id) { throw 'Missing or illegal parameter'; }
      if(! this.ids.has(item.id)) {
        this.ids.add(item.id);
        this.list.push(item);
      }
    };

    // returns array of objects
    this.toArray = function() {
      return this.list;
    };

    // returns size of set
    this.size = function() {
      return this.list.length;
    };
};

mongodb.connect('mongodb://localhost:27017/thinkdataapp-dev', { strict: true }, function(err, db) {
	if(! err) {
		console.log('Successfully connected to thinkdataapp-dev DB');
		db.collection('asn_api', function(err, col) {
			if(! err) {
				col.find({ name: 'asn_api_key' }).limit(1).toArray(
					function(err, items) { ASN_API_KEY = items[0].key; }
				);
			} else {
				console.error('Can\'t access ASN API key');
			}
		});
	} else {
		console.error('Could not connect thinkdataapp-dev DB');
	}
});

exports.getCurriculumData = function(req, res) {
  var grade = req.query.grade,
      subject = req.query.subject;

  // curriculum info retrieval data
  var data = {
    key: ASN_API_KEY,
    size: 1000,
    rank: 'description',
    'return-fields': 'description,education_level'
  };

  // build bq query param and url
  var bq = BQ_PREFIX + "+education_level:'" + grade + "'+subject:'" + subject + "')&",
      url = CURRICULUM_INFO_ENDPOINT + bq + querystring.stringify(data);

  // retrieve curriculum info for grade and subject
  request(url, function (error, response, body) {
    if (! error && response.statusCode === 200) {
      var currRawData = JSON.parse(body).hits.hit,
          currRefinedData = {};

      // modify requested data asynchronously and move forward only after
      // have gone through each element
      async.map(currRawData,
        function(element, callback) {
          var data = element.data,
              description = data.description.slice(1),
              title = data.description[0];

          // create key-value for subject title if DNE
          if(! currRefinedData[title]) {
            currRefinedData[title] = new IdSet();
          }

          // only use descriptions specific to one grade
          if(data.education_level.length === 1) {

            // if exisiting curriculum topic, find its data
            // else if new curriculum topic, save it
            async.map(description, function(desc, cb) {

              // calculate unique id for curriculum topic
              var id = hash({ grade: grade, subject: subject, title: title, description: desc });

              // attempt to find curriculum topic with calculated id
              CurriculumTopic.findOne({ id: id }, 'difficulty', function(err, cTopic) {
                if(err) {
                  console.error('Problem with finding curriculum topic data: ' + errorHandler.getErrorMessage(err));
                } else if(! cTopic) {
                  var newCurriTopic = new CurriculumTopic({ id: id, grade: grade, subject: subject, title: title, description: desc });

                  // attempt to save new curriculum topic model in database
                  newCurriTopic.save(function(err) {
                    if(err) {
                      console.error('Error with saving curriculum topic data: ' + errorHandler.getErrorMessage(err));
                    } else {
                      currRefinedData[title].add({ description: desc, rating: 0, id: id });
                      cb();
                    }
                  });
                } else {
                  currRefinedData[title].add({ description: desc, rating: cTopic.difficulty, id: id });
                  cb();
                }
              });
            }, function(err, results) {
              callback();
            });
          }
      }, function(err, results) {
           // remove all curriculum topics which have no data and convert sets to arrays
           for(var key in currRefinedData) {
             if(! currRefinedData[key].size()) {
               delete currRefinedData[key];
             } else {
               currRefinedData[key] = currRefinedData[key].toArray();
             }
           }
           res.send(currRefinedData);
         }
      );
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

exports.getCurriculumTopicData = function(req, res) {
  var id = req.query.id;

  // must specify id parameter for curriculum topic
  if(! id) {
    res.status(400).send({
       message: 'Missing \'id\' parameter'
    });
  }

  // find and return curriculum topic data corresponding to given id
  CurriculumTopic.findOne({ id: id }, function(err, curriculumTopic) {
    if(err) {
      res.status(400).send({
         message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(! curriculumTopic) {
        res.status(404).send({
           message: 'Currulum topic with specified id not found'
        });
      } else {
        res.json(curriculumTopic);
      }
    }
  });
};

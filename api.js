var express = require('express');
var bodyParser = require('body-parser');
var Clarifai = require('clarifai');
var redis = require("redis");

var router = express.Router();

router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

var cla = new Clarifai({
  id: process.env.CLARIFAI_ID,
  secret: process.env.CLARIFAI_SECRET
});

red = redis.createClient();

// get the rating for how fucking goldsmiths something is
router.get('/image', function(req, res) {
  cla.tagFromUrls('image', req.query.url, function(err, results) {
    if(!err) {
      red.zscore('tags', results.tags[0].class, function(err, result) {
        if(!err) {
          red.zrevrangebyscore('tags', '+inf', '-inf', 'WITHSCORES', 'LIMIT', '0', '1', function(err, highest) {
            if(!err) {
              if(results.tags[0].probability == null) {
                results.tags[0].probability = results.tags[0].conceptId;
              }
              res.send('' + ((result/highest[1]) * results.tags[0].probability || 0));
            } else {
              res.status(500).send(err);
            }
          });
        } else {
          res.status(500).send(err);
        }
      });
    } else {
      res.status(500).send(err);
    }
  });
});

// tell the api this image is so fucking goldsmiths
router.post('/image/tag', function(req, res) {
  cla.tagFromUrls('image', req.body.url, function(err, results) {
    if(!err) {
      results.tags.forEach(function(tag) {
        if(tag.probability == null) {
          tag.probability = tag.conceptId;
        }
        red.zincrby('tags', tag.probability, tag.class);
      });

      res.send('Tagged!');
    } else {
      res.status(500).send(err);
    }
  });
});

// tell the api this image is not fucking goldsmiths
router.post('/image/antitag', function(req, res) {
  cla.tagFromUrls('image', req.body.url, function(err, results) {
    if(!err) {
      results.tags.forEach(function(tag) {
        if(tag.probability == null) {
          tag.probability = tag.conceptId;
        }
        red.zincrby('tags', -tag.probability, tag.class);
      });

      res.send('Anit-tagged!');
    } else {
      res.status(500).send(err);
    }
  });
});

module.exports = router;

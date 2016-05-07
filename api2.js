var express = require('express');
var Clarifai = require('clarifai');

var router = express.Router();

var client = new Clarifai({
  id: "xqthaW9kNlpoimZqPd0h1WDkMECUd_AfFcILSuF6",
  secret: "JfVQll7nDTF--DaqXJEUP3Gx5sKvM6wcbusNUp67"
});

// get the rating for how fucking goldsmiths something is
router.get('/image', function(req, res) {
  client.tagFromUrls('image', [req.query.url], function(err, results) {
    if(!err) {
      console.log(results);
      var gs = results.tags.find(function(element) {
        return element.class == 'sofuckinggoldsmiths';
      });

      if(gs) {
        res.send('' + gs.probability);
      } else {
        res.send('0');
      }
    } else {
      res.status(500).send(err);
    }
  });
});

// tell the api this image is so fucking goldsmiths
router.post('/image/tag', function(req, res) {
  client.tagFromUrls('image', [req.body.url], function(err, results) {
    if(!err) {
      console.log(results.docId);
      client.addTags([results.docId], ['sofuckinggoldsmiths'], function(err, resp) {
        if(!err) {
          res.send(resp);
        } else {
          res.status(500).send('Error tagging image!');
        }
      });
    } else {
      res.status(500).send(err);
    }
  });
});

module.exports = router;

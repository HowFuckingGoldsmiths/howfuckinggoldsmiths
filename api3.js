var express = require('express');
var Clarifai = require('./clarifai_node.js');

var router = express.Router();

Clarifai.initAPI("xqthaW9kNlpoimZqPd0h1WDkMECUd_AfFcILSuF6", "JfVQll7nDTF--DaqXJEUP3Gx5sKvM6wcbusNUp67" );

// get the rating for how fucking goldsmiths something is
router.get('/image', function(req, res) {
  Clarifai.tagURL('http://spru.sr/img/sprusr.png', null, function(err, results) {
    if(!err) {
      console.log(results.results[0].result);
      var certainty = 0;

      results.results[0].result.tag.classes.forEach(function(c, i) {
        if(c == 'sofuckinggoldsmiths') {
          certainty = results.results[0].result.tag.probs[i];
        }
      });

      res.send('' + certainty);
    } else {
      res.status(500).send(err);
    }
  });
});

// tell the api this image is so fucking goldsmiths
router.post('/image/tag', function(req, res) {
  Clarifai.feedbackAddTagsToDocids('http://spru.sr/img/sprusr.png', ['sofuckinggoldsmiths'], null, function(err, results) {
    if(!err) {
      res.send(results);
    } else {
      res.status(500).send(err);
    }
	});
});

module.exports = router;

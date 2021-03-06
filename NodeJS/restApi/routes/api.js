const express = require('express');
const router = express.Router();
const Ninja = require('../models/ninja');

// Get list of ninjas from db
router.get('/ninjas', (req, res, next) => {
  // Ninja.find({}).then(ninjas => {
  //   res.send(ninjas);
  // });
  
  Ninja.aggregate().near({
    near: {
      type: 'Point',
      coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
    },
    maxDistance: 100000,
    spherical: true,
    distanceField: 'dis'
  }).then(ninjas => {
    res.send(ninjas);
  });
});

// Add new ninja to db
router.post('/ninjas', (req, res, next) => {
  Ninja.create(req.body).then(ninja => {
    res.send(ninja);
  }).catch(next);
});

// Update ninja in db
router.put('/ninjas/:id', (req, res, next) => {
  Ninja.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
    Ninja.findOne({_id: req.params.id}).then(ninja => {
      res.send(ninja);
    });
  });
});

// Delete ninja from db
router.delete('/ninjas/:id', (req, res, next) => {
  Ninja.findByIdAndRemove({_id: req.params.id}).then(ninja => {
    res.send(ninja);
  });
});

module.exports = router;
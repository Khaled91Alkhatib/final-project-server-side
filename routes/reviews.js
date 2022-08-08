/*
 * All routes for reviews are defined here
 */

const express = require('express');
const router  = express.Router();

const {addNewReview} = require('../db/queries/reviews/03-addNewReview');

module.exports = (db) => {

  router.post("/", (req, res) => {

    console.log(req.body);
    const review = req.body.review;

    addNewReview(db, review)
    .then(data => {
      console.log('✅','review added');
      res.json(data.rows[0]);
    })
    .catch(err => {
      console.log(err);
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  return router;
};

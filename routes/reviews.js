/*
 * All routes for reviews are defined here
 */

const express = require('express');
const router  = express.Router();

const {addNewReview} = require('../db/queries/reviews/03-addNewReview');
const {getAllNewReviews} = require('../db/queries/reviews/04-getAllNewReviews');
const {updateReview} = require('../db/queries/reviews/05-updateReview');

module.exports = (db) => {

  router.post("/", (req, res) => {

    // console.log(req.body);
    const review = req.body.review;

    addNewReview(db, review)
    .then(data => {
      // console.log('✅','review added');
      res.json(data.rows[0]);
    })
    .catch(err => {
      console.log(err);
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  router.get("/", (req, res) => {
    const f1 = getAllNewReviews(db);
    Promise.all([f1])
    .then(([r1]) => {
      const newReviews = r1.rows;
      res.json({ newReviews });
      return;
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });;
  });

  router.post("/edit", (req, res) => {

    // console.log(req.body);
    const updatedInfo= req.body.info;

    const updatePromises = [];
    for (const data of updatedInfo) {
      updatePromises.push(updateReview(db, data))
    }

    Promise.all(updatePromises)
    .then(data => {
      // console.log('✅','reviews updated');
      res.json(data.rows);
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

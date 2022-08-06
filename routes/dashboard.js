/*
 * All routes for dashboard are defined here
 */

const express = require('express');
const router  = express.Router();

const {getTopSeller} = require('../db/queries/dashboard/01-getTopSeller');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const f1 = getTopSeller(db);
    Promise.all([f1])
    .then(([r1]) => {
      const topSeller = r1.rows;
      res.json({ topSeller });
      return;
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });;
  });

  return router;
};

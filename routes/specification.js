/*
 * All routes for specification are defined here
 * Since this file is loaded in server.js into api/specification,
 */

const express = require('express');
const router  = express.Router();

const {getCategories} = require('../db/queries/products/02-getCategories');
const {getStyles} = require('../db/queries/products/03-getStyles');
const {getColors} = require('../db/queries/products/04-getColors');
const {getSizes} = require('../db/queries/products/05-getSizes');

module.exports = (db) => {
  router.get("/", (req, res) => {

    const f1 = getCategories(db);
    const f2 = getStyles(db);
    const f3 = getColors(db);
    const f4 = getSizes(db);

    Promise.all([f1, f2, f3, f4])
    .then(([r1, r2, r3, r4]) => {
      const categories = r1.rows;
      const styles = r2.rows;
      const colors = r3.rows;
      const sizes = r4.rows;
      res.json({ categories, styles, colors, sizes });
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

/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/products,
 */

const express = require('express');
const router  = express.Router();

const {getAllProducts} = require('../db/queries/products/01-getAllProducts');
const {getCategories} = require('../db/queries/products/02-getCategories');
const {getStyles} = require('../db/queries/products/03-getStyles');
const {getColors} = require('../db/queries/products/04-getColors');
const {getSizes} = require('../db/queries/products/05-getSizes');

module.exports = (db) => {
  router.get("/", (req, res) => {

    const f1 = getAllProducts(db);
    const f2 = getCategories(db);
    const f3 = getStyles(db);
    const f4 = getColors(db);
    const f5 = getSizes(db);

    Promise.all([f1, f2, f3, f4, f5])
    .then(([r1, r2, r3, r4, r5]) => {
      const products = r1.rows;
      const categories = r2.rows;
      const styles = r3.rows;
      const colors = r4.rows;
      const sizes = r5.rows;
      res.json({ products, categories, styles, colors, sizes });
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

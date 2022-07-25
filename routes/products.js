/*
 * All routes for products are defined here
 * Since this file is loaded in server.js into api/products,
 */

const express = require('express');
const router  = express.Router();

const {getAllProducts} = require('../db/queries/products/01-getAllProducts');
const {getProductById} = require('../db/queries/products/06-getProductById');
const {getAvailableSizesById} = require('../db/queries/products/07-getAvailableSizesById');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const f1 = getAllProducts(db);

    Promise.all([f1])
    .then(([r1]) => {
      const products = r1.rows;
      res.json({ products });
      return;
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });;
  });

  router.get("/:id", (req, res) => {
    const curId = req.params.id;
    const f1 = getProductById(db, curId);
    const f2 = getAvailableSizesById(db, curId);

    Promise.all([f1, f2])
    .then(([r1, r2]) => {
      const product = r1.rows[0];
      const availableSizes = r2.rows;
      res.json({ product, availableSizes });
      return;
    })
    .catch(err => {
      console.log(err.message);
      res
      .status(500)
      .json({ error: err.message });
    });;
  });

  return router;
};

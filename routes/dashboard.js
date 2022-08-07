/*
 * All routes for dashboard are defined here
 */

const express = require('express');
const router  = express.Router();

const {getBestSellingProduct} = require('../db/queries/dashboard/01-getBestSellingProduct');
const {totalSale5Days} = require('../db/queries/dashboard/02-totalSale5Days');
const {getBestSellingSize} = require('../db/queries/dashboard/03-getBestSellingSize');
const {getMostPopularColor} = require('../db/queries/dashboard/04-getMostPopularColor');

module.exports = (db) => {

  router.get("/", (req, res) => {

    const f1 = getBestSellingProduct(db);
    const f2 = totalSale5Days(db);
    const f3 = getBestSellingSize(db);
    const f4 = getMostPopularColor(db);

    Promise.all([f1, f2, f3, f4])
    .then(([r1, r2, r3, r4]) => {
      const topSellProducts = r1.rows;
      const totalSales = r2.rows;
      const topSellSizes = r3.rows;
      const topSellColors = r4.rows;

      res.json({ topSellProducts, totalSales, topSellSizes, topSellColors });
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

/*
 * All routes for inventory are defined here
 * Since this file is loaded in server.js into api/inventory,
 */

const express = require('express');
const router  = express.Router();

const {getInventoryInfo} = require('../db/queries/inventory/01-getInventoryInfo');
const {updateInventory} = require('../db/queries/inventory/02-updateInventory');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const f1 = getInventoryInfo(db);
    Promise.all([f1])
    .then(([r1]) => {
      const inventoryInfo = r1.rows;
      res.json({ inventoryInfo });
      return;
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });;
  });

  router.post("/", (req, res) => {

    const barcode = req.body.barcode;
    const newQty = req.body.newQty;
    updateInventory(db, barcode, newQty)
    .then(data => {
      // console.log('✅','update inventory done');
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

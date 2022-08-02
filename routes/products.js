/*
 * All routes for products are defined here
 * Since this file is loaded in server.js into api/products,
 */

const express = require('express');
const router  = express.Router();

const {getAllProducts} = require('../db/queries/products/01-getAllProducts');
const {getProductById} = require('../db/queries/products/06-getProductById');
const {getAvailableSizesById} = require('../db/queries/products/07-getAvailableSizesById');
const {addNewProduct} = require('../db/queries/products/08-addNewProduct');
const {addProductSize} = require('../db/queries/products/09-addProductSize');
const {addBarcodeToInventory} = require('../db/queries/products/10-addBarcodeToInventory');
const {findProductSizeByBarcode} = require('../db/queries/products/11-findProductSizeByBarcode');

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

  router.post("/", (req, res) => {

    const newProduct = (req.body.product);
    const newSizeData = (req.body.sizeData);
    const barcodesArray = newSizeData.map(row => row.barcode);

    const findDuplicationPromises = [];
    for (const barcode of barcodesArray) {
      findDuplicationPromises.push(findProductSizeByBarcode(db, barcode));
    }
    Promise.all(findDuplicationPromises)
    .then(data => {
      const duplication = data.filter(row => row.rowCount > 0)
      if (duplication.length !== 0) {
        res.json({ errCode: 1001, errMsg: `Error: There is duplication in barcodes! Product didn't add to database.`})
        return;
      } else {
        addNewProduct(db, newProduct)
        .then(data => {
          console.log('✅','add done');
          return getProductById(db, data.rows[0].id)
        })
        .then(item => {
          res.json(item.rows[0]);
          const productId = item.rows[0].id;
          const addBarcodePromises = [];
          for (const row of newSizeData) {
            addBarcodePromises.push(addProductSize(db, row.barcode, productId, row.size_id));
          }
          Promise.all(addBarcodePromises)
          .then ( data => {
            console.log('✅ All barcodes added to DB');
            const addInventoryRowPromises = [];
            for (const row of newSizeData) {
              addInventoryRowPromises.push(addBarcodeToInventory(db, row.barcode));
            }
            Promise.all(addInventoryRowPromises)
            .then(() => {
              console.log('✅ All inventory lines added to DB');
              // console.log('🚨🚨',data.rows)             // 🚨🚨🚨
              // res.json({ data });
              return;
            })
          })
        })
      }
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

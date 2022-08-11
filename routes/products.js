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
const {updateProductById} = require('../db/queries/products/12-updateProductById');
const {getReviewsById} = require('../db/queries/reviews/01-getReviewsById');
const {getAvgRating} = require('../db/queries/reviews/02-getAvgRating');

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

    let product, availableSizes
    const f1 = getProductById(db, curId);
    const f2 = getAvailableSizesById(db, curId);

    Promise.all([f1, f2])
    .then(([r1, r2]) => {
      product = r1.rows[0];
      availableSizes = r2.rows;

      const code = product.sku.slice(0, 4);
      const f3 = getReviewsById(db, code);
      const f4 = getAvgRating(db, code);
      return Promise.all([f3, f4])
    })
    .then(([r3, r4])=> {
      const reviews = r3.rows;
      const averageRating = r4.rows[0];
      res.json({ product, availableSizes, reviews, averageRating });
      return;
    })
    .catch(err => {
      // console.log(err.message);
      res
      .status(500)
      .json({ error: err.message });
    });
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
        res.json({ errCode: 1001, errMsg: `Error: There is duplication in barcodes! Product is not added.`})
        return;
      } else {
        addNewProduct(db, newProduct)
        .then(data => {
          // console.log('✅','add done');
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
            // console.log('✅ All barcodes added to DB');
            const addInventoryRowPromises = [];
            for (const row of newSizeData) {
              addInventoryRowPromises.push(addBarcodeToInventory(db, row.barcode));
            }
            Promise.all(addInventoryRowPromises)
            .then(() => {
              // console.log('✅ All inventory lines added to DB');
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

  router.put("/:id", (req, res) => {

    const product = req.body.product;
    const newSizeData = req.body.sizeData;
    const id = req.params.id;

    const barcodesArray = newSizeData.map(row => row.barcode);

    const findDuplicationPromises = [];
    for (const barcode of barcodesArray) {
      findDuplicationPromises.push(findProductSizeByBarcode(db, barcode));
    }
    Promise.all(findDuplicationPromises)
    .then(data => {
      const duplication = data.filter(row => row.rowCount > 0)
      if (duplication.length !== 0) {
        res.json({ errCode: 1002, errMsg: `Error: There is duplication in barcodes! Product is not updated.`})
        return;
      } else {
        updateProductById(db, id, product)
        .then(data => {
          // console.log('✅','Edit done');
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
            // console.log('✅ All barcodes added to DB');
            const addInventoryRowPromises = [];
            for (const row of newSizeData) {
              addInventoryRowPromises.push(addBarcodeToInventory(db, row.barcode));
            }
            Promise.all(addInventoryRowPromises)
            .then(() => {
              // console.log('✅ All inventory lines added to DB');
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
  })


  return router;
};

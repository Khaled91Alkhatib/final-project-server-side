const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const uuid = require('uuid').v4;

router.use(express.urlencoded({ extended: false }));
router.use(bodyParser.json());

const { addToOrderLines } = require("../db/queries/orders/01-addToOrderLines");
const { addToOrders } = require("../db/queries/orders/02-addToOrders");
const { getCartUpdated } = require("../db/queries/orders/03-getCartUpdated");
const {reduceInventory} = require("../db/queries/orders/04-reduceInventory");
const {getOrdersInfoByDateRange} = require("../db/queries/orders/05-getOrdersInfoByDateRange");
const {getOrderDetailsByDateRange} = require("../db/queries/orders/06-getOrderDetailsByDateRange");


module.exports = (db) => {

  router.post("/", async (req, res) => {
    // console.log("body", req.body);
    let error, status;

    try {
      const { cart, token } = req.body;

      const totalEndPriceBeforeTaxes = cart.reduce((total, item) => {
        const totalPriceOfEachProduct = (item.quantity / 100) * item.price;
        return totalPriceOfEachProduct + total;
      }, 0);

      const taxes = totalEndPriceBeforeTaxes * 0.13;
      const totalAfterTaxes = (totalEndPriceBeforeTaxes + taxes);
      // console.log("with taxes", totalAfterTaxes.toFixed(2));
      // console.log('total', totalEndPrice);
      // console.log('stripe', stripe)

      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });
      // console.log("customer", customer)
      const key = uuid();
      const charge = await stripe.charges.create(
        {
          amount: Math.floor((totalAfterTaxes * 100).toFixed(2)),
          currency: "cad",
          customer: customer.id,
          receipt_email: token.email,
          description: `${token.card.name}'s order`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            },
          },
        },
        // {
        //   key,
        // }
      );
      // console.log("Charge:", { charge });
      status = "success";

      const newOrder = await addToOrders(db, charge.amount, req.body.token)
      // console.log("newLog", newOrder)

      const orderLinesPromiseArray = [];
      for (const orderLine of cart) {
        orderLinesPromiseArray.push(addToOrderLines(db, orderLine, newOrder.rows[0].id))
        orderLinesPromiseArray.push(reduceInventory(db, orderLine.barcode, orderLine.quantity))
      }
      const results = await Promise.all(orderLinesPromiseArray);
    } catch (error) {
      console.log("error", error);
      status = "failure";
    }
    res.json({ error, status });
  });

  router.get("/validation", (req, res) => {
    getCartUpdated(db)
    .then(data => {
      const updatedInfo = data.rows;
      res.json({ updatedInfo });
      return;
    })
    .catch(err => {
      res
      .status(500)
      .json({ error: err.message });
    });
  });

  router.get("/", (req, res) => {

    // console.log("🟣",req.query)

    const start = req.query.fromDate;
    const end = req.query.toDate;

    const f1 = getOrdersInfoByDateRange(db, start, end);
    const f2 = getOrderDetailsByDateRange(db, start, end);
    Promise.all([f1, f2])
    .then(([r1, r2]) => {
      const ordersInfo = r1.rows;
      const orderDetails = r2.rows;
      res.json({ ordersInfo, orderDetails });
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


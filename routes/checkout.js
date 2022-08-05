const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const uuid = require('uuid').v4;

router.use(express.urlencoded({ extended: false }));
router.use(bodyParser.json());

const { addToOrderLines } = require("../db/queries/orders/01-addToOrderLines")
const { addToOrders } = require("../db/queries/orders/02-addToOrders")


module.exports = (db) => {

  router.post("/", async (req, res) => {
    console.log("body", req.body);
    let error, status;

    try {
      const { cart, token } = req.body;

      const totalEndPriceBeforeTaxes = cart.reduce((total, item) => {
        const totalPriceOfEachProduct = (item.quantity / 100) * item.price;
        return totalPriceOfEachProduct + total;
      }, 0);

      const taxes = totalEndPriceBeforeTaxes * 0.13;
      const totalAfterTaxes = (totalEndPriceBeforeTaxes + taxes);
      console.log("with taxes", totalAfterTaxes.toFixed(2));
      // console.log('total', totalEndPrice);
      // console.log('stripe', stripe)

      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });
      // console.log("customer", customer)
      const key = uuid();
      // console.log('token', token);
      // console.log('key', key);
      // console.log('cart', cart);
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

      const orderLine = await addToOrderLines(db, req.body.cart[0], newOrder.rows[0].id)
      console.log("orderLine", orderLine)

    } catch (error) {
      console.log("error", error);
      status = "failure";
    }
    res.json({ error, status });

    // router.post("/api/orders", (req, res) => {
    //   console.log("orders", req)
    // })
  });
  return router;
};


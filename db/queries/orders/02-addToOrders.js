const addToOrders = (db, subtotal, stripeData) => {
  return db.query(`
  INSERT INTO orders
  (subtotal, user_name, user_email, user_address, user_city, user_postal_code)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING * ;`, [subtotal, stripeData.card.name, stripeData.email, stripeData.card.address_line1, stripeData.card.address_city, stripeData.card.address_zip ])
}

module.exports = { addToOrders }

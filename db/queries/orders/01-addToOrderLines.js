const addToOrderLines = (db, order, id) => {
  return db.query(`
  INSERT INTO order_lines
  (order_id, product_size_id, product_id, qty, price, name, color)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING * ;`, [id, order.barcode, order.product_id, order.quantity, order.price, order.name, order.color])
}

module.exports = { addToOrderLines }

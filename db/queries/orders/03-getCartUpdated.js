const getCartUpdated = (db) => {
  return db.query(`
  SELECT product_sizes.id as barcode,
    inventory.quantity as qty,
    products.price as price
  FROM product_sizes
  JOIN products On product_sizes.product_id = products.id
  JOIN inventory On product_sizes.id = inventory.barcode;`)
}

module.exports = { getCartUpdated };

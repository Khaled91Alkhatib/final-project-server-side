const getAvailableSizesById = (db, id) => {
  return db.query(`
    SELECT products.id as id,
    product_sizes.size_id as size_id, product_sizes.id as barcode,
    sizes.size as size,
    inventory.quantity as quantity
    FROM products
    JOIN product_sizes ON product_sizes.product_id = products.id
    JOIN sizes ON product_sizes.size_id = sizes.id
    JOIN inventory ON inventory.barcode = product_sizes.id
    WHERE products.id = $1
    ORDER BY product_sizes.size_id;`, [id])
}

module.exports = { getAvailableSizesById };

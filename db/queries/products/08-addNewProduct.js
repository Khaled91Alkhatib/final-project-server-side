const addNewProduct = (db, product) => {
  return db.query(`
  INSERT INTO products
  (sku, category_id, style_id, color_id,
    name, description, image1, image2, image3, price, disp)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
   RETURNING *;`, [product.sku, product.category_id, product.style_id,
    product.color_id, product.name, product.description,
    product.image1, product.image2, product.image3,
    product.price * 100, product.disp])
}
module.exports = { addNewProduct };

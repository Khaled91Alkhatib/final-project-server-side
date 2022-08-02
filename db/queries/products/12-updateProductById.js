const updateProductById = (db, id, product) => {
  return db.query(`
  UPDATE products
  SET category_id = $1,
      style_id = $2,
      color_id = $3,
      name = $4,
      description = $5,
      image1 = $6,
      image2 = $7,
      image3 = $8,
      price = $9,
      disp = $10
  WHERE id = $11
  RETURNING *;`,
  [product.category_id, product.style_id,
    product.color_id, product.name, product.description,
    product.image1, product.image2, product.image3,
    product.price * 100 , product.disp, id])
}
module.exports = { updateProductById };

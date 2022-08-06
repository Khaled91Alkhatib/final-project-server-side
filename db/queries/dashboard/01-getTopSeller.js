const getTopSeller = (db) => {
  return db.query(`
  select name, sum(qty) from order_lines group by name;`)
}

module.exports = { getTopSeller };

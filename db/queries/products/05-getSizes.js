const getSizes = (db) => {
  return db.query(`
    SELECT * FROM sizes
    ORDER BY id
    ;`)
}

module.exports = { getSizes };

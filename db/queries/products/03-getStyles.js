const getStyles = (db) => {
  return db.query(`
    SELECT * FROM Styles
    ORDER BY id
    ;`)
}

module.exports = { getStyles };

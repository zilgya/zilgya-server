const { db } = require("../config/database");

const getPromo = (body) => {
  return new Promise((resolve, reject) => {
    const { code } = body;
    let sqlQuery = "select * from promos where lower(code)=$1 ";
    db.query(sqlQuery, [code])
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "Promo Not Found" });
        }
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

module.exports = {
  getPromo,
};

const { db } = require("../config/database");

const getPromo = (params) => {
  return new Promise((resolve, reject) => {
    const { code } = params;
    let sqlQuery = "select * from promos where lower(code)=lower($1) ";
    db.query(sqlQuery, [code])
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 401, err: "Invalid Promo Code" });
        }
        const response = {
          total: result.rowCount,
          data: result.rows[0],
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

const { db } = require('./../config/database')

const register = (email, hashedPassword, roles_id) => {
    return new Promise((resolve, reject) => {
        const sqlQuery =
          "INSERT INTO users (email, password, roles_id, created_at) VALUES ($1, $2, $3, $4) returning *";
      const created_at = new Date(Date.now());
      const values = [email, hashedPassword, roles_id, created_at];
      db.query(sqlQuery, values)
        .then(() => { 
          resolve();
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  };
  
  const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      const sqlQuery = "SELECT * FROM users WHERE email = $1";
      db.query(sqlQuery, [email])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  };
  
  const getPassByUserEmail = async (email) => {
    try {
      const sqlQuery = "SELECT * FROM users WHERE email = $1";
      const result = await db.query(sqlQuery, [email]);
      // cek apakah ada pass
      if (result.rowCount === 0)
        throw { status: 400, err: { msg: "Email is not registered" } };
      return result.rows[0];
    } catch (error) {
      const { status = 500, err } = error;
      throw { status, err };
    }
  };
  
  module.exports = { register, getUserByEmail, getPassByUserEmail };
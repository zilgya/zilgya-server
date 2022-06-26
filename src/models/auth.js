const { ErrorHandler } = require("../middlewares/errorHandler");
const { db } = require("./../config/database");

const register = (email, hashedPassword, roles_id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "INSERT INTO users (email, password, roles_id, created_at, username) VALUES ($1, $2, $3, $4, $1) returning *";
    const created_at = new Date(Date.now());
    const values = [email, hashedPassword, roles_id, created_at];
    db.query(sqlQuery, values)
      .then((result) => {
        resolve({ data: result.rows[0] });
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
    if (result.rowCount === 0) {
      throw new ErrorHandler({ status: 400, message: "Email is not registered" });
    }
    return result.rows[0];
  } catch (error) {
    const { status = 500, message } = error;
    throw new ErrorHandler({ status, message });
  }
};

const verifyEmail = async (email) => {
  try {
    let sqlQuery = "UPDATE users SET status='active' WHERE email=$1 RETURNING *";
    const result = await db.query(sqlQuery, [email]);
    if (!result.rowCount) throw new ErrorHandler({ status: 404, message: "User Not Found" });
    return {
      data: result.rows[0],
    };
  } catch (err) {
    throw new ErrorHandler({ status: err.status ? err.status : 500, message: err.message });
  }
};

module.exports = { register, getUserByEmail, getPassByUserEmail, verifyEmail };

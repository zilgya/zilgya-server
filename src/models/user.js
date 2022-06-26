const { db } = require("../config/database");
const bcrypt = require("bcrypt");
const { ErrorHandler } = require("../middlewares/errorHandler");

const getUserbyId = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT * from users WHERE id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject({ status: 404, err: "User Not Found" });
        }
        const response = {
          data: data.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const updateUser = (id, body, file) => {
  return new Promise((resolve, reject) => {
    const { username, email, gender, description, address, phone_number, store_name } = body;
    const updated_at = new Date(Date.now());
    const photo = file ? file.path : null;
    const sqlQuery =
      "UPDATE users SET username= COALESCE($1, username), email= COALESCE($2, email), gender= COALESCE($3, gender), description= COALESCE($4, description), address= COALESCE($5, address), phone_number= COALESCE($6, phone_number), store_name= COALESCE($7, store_name), updated_at = $9, photo= COALESCE(NULLIF($10, ''), photo) WHERE id=$8 RETURNING *";
    db.query(sqlQuery, [username, email, gender, description, address, phone_number, store_name, id, updated_at, photo])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: "Your data has been updated!",
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const updateUserPassword = async (newPassword, email) => {
  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    const resetPass = await db.query("UPDATE users set password = $1 WHERE email = $2 RETURNING *", [hashedNewPassword, email]);
    if (!resetPass.rowCount) throw new ErrorHandler({ status: 404, message: "Email Not Found" });
    return {
      message: "Your Password successfully recovered",
    };
  } catch (error) {
    const { status, message } = error;
    throw new ErrorHandler({ status: status ? status : 500, message });
  }
};

module.exports = {
  getUserbyId,
  updateUser,
  updateUserPassword,
};

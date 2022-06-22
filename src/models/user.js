const { db } = require("../config/database");

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
    const {
      username,
      email,
      gender,
      description,
      address,
      phone_number,
      store_name,
    } = body;
    const updated_at = new Date(Date.now());
    const photo = file ? file.path : null;
    const sqlQuery =
      "UPDATE users SET username= COALESCE($1, username), email= COALESCE($2, email), gender= COALESCE($3, gender), description= COALESCE($4, description), address= COALESCE($5, address), phone_number= COALESCE($6, phone_number), store_name= COALESCE($7, store_name), updated_at = $9, photo= COALESCE(NULLIF($10, ''), photo) WHERE id=$8 RETURNING *";
    db.query(sqlQuery, [
      username,
      email,
      gender,
      description,
      address,
      phone_number,
      store_name,
      id,
      updated_at,
      photo,
    ])
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

module.exports = {
  getUserbyId,
  updateUser,
};

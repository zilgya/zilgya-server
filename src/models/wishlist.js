const { db } = require("../config/database");
const { ErrorHandler } = require("../helpers/errorHandler");

const readWishlist = async (user_id) => {
  try {
    let sqlQuery =
      "SELECT p.id as product_id,p.users_id as user_id,p.name as name,p.description as description,p.price as price,p.stock as stock,p.stock_condition as stock_condition,i.url as image from wishlist w join products p on w.product_id=p.id join images i on p.id=i.product_id  where user_id = $1";
    const result = await db.query(sqlQuery, [user_id]);
    if (!result.rowCount) throw new ErrorHandler({ status: 404, message: "Wishlist not Found" });
    return {
      data: result.rows,
    };
  } catch (error) {
    const { status, message } = error;
    throw new ErrorHandler({ status: status ? status : 500, message });
  }
};
const createWishlist = async (user_id, product_id) => {
  try {
    let sqlQuery = "INSERT INTO wishlist(user_id,product_id) values($1,$2) returning *";
    const result = await db.query(sqlQuery, [user_id, product_id]);
    return {
      data: result.rows[0],
      message: "Wishlist has been added to your account",
    };
  } catch (error) {
    const { status = status ? status : 500, message } = error;
    throw new ErrorHandler({ status: status ? status : 500, message });
  }
};
const removeWishlist = async (product_id) => {
  try {
    let sqlQuery = "DELETE FROM wishlist WHERE product_id = $1";
    const result = await db.query(sqlQuery, [product_id]);
    return {
      data: result.rows[0],
      message: "Wishlist has been removed from your account",
    };
  } catch (error) {
    const { status = status ? status : 500, message } = error;
    throw new ErrorHandler({ status: status ? status : 500, message });
  }
};

module.exports = { readWishlist, createWishlist, removeWishlist };

const { db } = require("../config/database");
const { ErrorHandler } = require("../helpers/errorHandler");

const readWishlist = async (user_id) => {
  try {
    let sqlQuery =
      "SELECT distinct on(w.product_id)p.users_id,p.id as product_id,w.id,p.name as name,p.description as description,p.price as price,p.stock as stock,p.stock_condition as stock_condition,i.url as image from wishlist w join products p on w.product_id=p.id join images i on p.id=i.product_id  where user_id = $1";
    const result = await db.query(sqlQuery, [user_id]);
    if (!result.rowCount)
      throw new ErrorHandler({ status: 404, message: "Wishlist not Found" });
    return {
      data: result.rows,
      total: result.rowCount,
    };
  } catch (error) {
    const { status, message } = error;
    throw new ErrorHandler({ status: status ? status : 500, message });
  }
};
const readWishlistByIdProduct = async (user_id, product_id) => {
  try {
    let sqlQuery =
      "select distinct w.product_id, p.name as product_name from wishlist w join products p on w.product_id =p.id WHERE user_id =$1 and w.product_id =$2";
    const result = await db.query(sqlQuery, [user_id, product_id]);
    // const name = result.rows.data. 
    if (!result.rowCount)
      return {data: result.rows, message: `Product can be added to wishlist` };
    return {
      data: result.rows,
      message: 'Already on wishlist'
    };
  } catch (error) {
    const { status, message } = error;
    throw new ErrorHandler({ status: status ? status : 500, message });
  }
};
const createWishlist = async (user_id, product_id) => {
  try {
    let sqlQuery =
      "INSERT INTO wishlist(user_id,product_id) values($1,$2) returning *";
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

module.exports = {
  readWishlist,
  readWishlistByIdProduct,
  createWishlist,
  removeWishlist,
};

const { client } = require("../config/redis");
const { getUserbyId, updateUser, updateUserPassword } = require("../models/user");

const getUserInfo = (req, res) => {
  getUserbyId(req.userPayload.id)
    .then((result) => {
      const { data } = result;
      res.status(200).json({
        data,
        err: null,
      });
    })
    .catch((error) => {
      const { err, status } = error;
      res.status(status).json({ err, data: [] });
    });
};

const patchUserInfo = (req, res) => {
  const { file = null } = req;
  updateUser(req.userPayload.id, req.body, file)
    .then((result) => {
      const { data, msg } = result;
      res.status(200).json({
        data,
        msg,
      });
    })
    .catch((error) => {
      const { err, status } = error;
      res.status(status).json({ err, data: [] });
    });
};

const patchUserPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmCode } = req.body;
    const confirm = await client.get(`forgotpass${email}`);
    if (confirm !== confirmCode) {
      res.status(403).json({ error: "Invalid Confirmation Code !" });
      return;
    }
    const { message } = await updateUserPassword(newPassword, email);
    if (message) {
      await client.del(`forgotpass${email}`);
    }
    res.status(200).json({
      message,
    });
  } catch (error) {
    const { message, status } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

module.exports = {
  getUserInfo,
  patchUserInfo,
  patchUserPassword,
};

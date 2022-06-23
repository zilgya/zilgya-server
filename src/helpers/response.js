const response = {};

response.successResponse = (res, status, data, total) => {
  res.status(status).json({
    data,
    total,
    err: null,
  });
};

response.errorResponse = (res, status, err) => {
  res.status(status).json({
    err,
    data: [],
  });
};

module.exports = response;

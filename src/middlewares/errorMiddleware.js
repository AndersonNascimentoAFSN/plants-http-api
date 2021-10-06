const errorMiddleware = (error, _req, res, _next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
};

module.exports = errorMiddleware;
const routeNotFoundMiddleware = (_req, _res, next) => {
  const error = new Error('Rota não encontrada');
  error.status = 404;
  next(error);
};

module.exports = routeNotFoundMiddleware;

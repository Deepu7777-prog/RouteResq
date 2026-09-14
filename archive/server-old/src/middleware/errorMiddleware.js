function errorHandler(err, req, res, next) {
  console.error('[RouteResQ Server Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;

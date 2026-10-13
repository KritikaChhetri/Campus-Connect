const requestLogger = (req, res, next) => {
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Time: ${new Date().toLocaleString()}`);

  next();
};

module.exports = requestLogger;
const sendNotification = (_, res, next) => {
  console.log("send", res.locals);
  next();
};

module.exports = sendNotification;

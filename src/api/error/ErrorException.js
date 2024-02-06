module.exports = function ErrorException(message) {
  this.status = 400;
  this.message = message;
};

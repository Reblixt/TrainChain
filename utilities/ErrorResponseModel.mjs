export default class ErrorResponse extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = `${statusCode}`.startsWith("4") ? false : true;
  }
}

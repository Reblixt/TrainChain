export default class ResponseModel {
  constructor({ statusCode = 404, data = null, error = null }) {
    this.success = false;
    this.statusCode = statusCode;
    if (statusCode >= 200 && statusCode <= 299) this.success = true;
    this.data = data;
    this.error = error;
  }
}

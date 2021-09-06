export default class InvalidParameterError extends Error {
  constructor(msg: string) {
      super(msg);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, InvalidParameterError.prototype);
  }
}
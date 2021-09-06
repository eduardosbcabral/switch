export default class SwitchError extends Error {
  constructor(msg: string) {
      super(msg);

      Object.setPrototypeOf(this, SwitchError.prototype);
  }
}
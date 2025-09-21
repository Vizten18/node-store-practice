const { v4: uuidv4 } = require("uuid");

export class UuidAdapter {
  static v4() {
    return uuidv4();
  }
}

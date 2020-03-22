const crypto = require("crypto");
const util = require("util");
const Database = require("./Database.js");

const scrypt = util.promisify(crypto.scrypt);

class UsersDB extends Database {
  async create(attrs) {
    attrs.id = this.randomID();

    const salt = this.randomID();
    const buf = await scrypt(attrs.password, salt, 64);
    const hashed = buf.toString("hex");

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${hashed}.${salt}`
    };
    records.push(record);

    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    // saved -> stored in db "hashed.salt"
    // supplied -> from a form in plain test
    const [hashed, salt] = saved.split(".");
    const buf = await scrypt(supplied, salt, 64);

    return hashed === buf.toString("hex");
  }
}

module.exports = new UsersDB("users.json");
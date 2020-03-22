const fs = require("fs");
const crypto = require("crypto");

module.exports = class Database {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a new Database require a filename");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll(id) {
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf8" })
    );
  }

  async get(id) {
    const records = await this.getAll();
    return records.find(r => r.id === id);
  }

  async getBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
          break;
        }
      }

      if (found) { return record; }
    }

    return null;
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  async create(attrs) {
    attrs.id = this.randomID();

    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
    return attrs;
  }

  async delete(id) {
    const records = await this.getAll();
    const filtered = records.filter(record => record.id !== id);
    await this.writeAll(filtered);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) { throw new Error(`Record with ID ${id} not found`); }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  randomID() {
    return crypto.randomBytes(8).toString("hex");
  }
}
const Database = require("./Database.js");

class FoodsDB extends Database {
  async create(attrs) {
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
    return attrs;
  }
}

module.exports = new FoodsDB("foods.json");
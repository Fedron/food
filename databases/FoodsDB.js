const Database = require("./Database.js");

class FoodsDB extends Database {
  async create(attrs) {
    attrs["timesUsed"] = 0;
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
    return attrs;
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) { throw new Error(`Record with ID ${id} not found`); }

    record.foods = attrs;
    await this.writeAll(records);
  }
}

module.exports = new FoodsDB("foods.json");
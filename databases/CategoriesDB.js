const Database = require("./Database.js");

class CategoriesDB extends Database {
  async create(attrs) {
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
    return attrs;
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) { throw new Error(`Record with ID ${id} not found`); }

    record.categories = attrs;
    await this.writeAll(records);
  }
}

module.exports = new CategoriesDB("categories.json");
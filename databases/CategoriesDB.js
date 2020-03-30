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

  async getBy(userID, filters) {
    const userCategories = await this.get(userID);

    for (let category of userCategories.categories) {
      let found = true;
      for (let key in filters) {
        if (category[key] !== filters[key]) {
          found = false;
          break;
        }
      }

      if (found ) { return category }
    }

    return null;
  }

  async delete(userID, categoryID) {
    const records = await this.getAll();
    let record = records.find(r => r.id === userID);
    record.categories = record.categories.filter(r => r.id !== categoryID);

    await this.writeAll(records);
  }
}

module.exports = new CategoriesDB("categories.json");
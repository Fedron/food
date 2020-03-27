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

    // for (let record of records) {
    //   let found = true;
    //   for (let category of record.categories) {
    //     console.log(category);
    //     for (let key in filters) {
    //       if (category[key] !== filters[key]) {
    //         found = false;
    //         break;
    //       }
    //     }
    //   }

    //   if (found) { return record; }
    // }

    // return null;
  }
}

module.exports = new CategoriesDB("categories.json");
const Database = require("./Database.js");

class FoodsDB extends Database {
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
    
    for (let a of attrs) {
      if (a["timesUsed"] !== 0) {
        a["timesUsed"] = 0;
        a["images"] = [];
      }
    }

    record.foods = attrs;

    await this.writeAll(records);
  }

  async addImages(userID, foodID, images) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === userID);
    const food = record.find((r) => r.id === foodID);

    for (image of images) {
      food.push(image);
    }

    await this.writeAll(records);
  }
}

module.exports = new FoodsDB("foods.json");
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
    
    if (attrs["timesUsed"] !== 0) {
      attrs["timesUsed"] = 0;
      attrs["images"] = [];
    }

    record.foods.push(attrs);

    await this.writeAll(records);
  }

  async addImage(userID, payload) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === userID);

    if (!record) { throw new Error(`Record with ID ${id} not found`); }

    const food = record.foods.find((f) => f.id === payload.id);
    food.images.push({ name: payload.name, data: payload.data });

    await this.writeAll(records);
  }

  async delete(userID, foodID) {
    const records = await this.getAll();
    let record = records.find(r => r.id === userID);
    record.foods = record.foods.filter(r => r.id !== foodID);

    await this.writeAll(records);
  }
}

module.exports = new FoodsDB("foods.json");
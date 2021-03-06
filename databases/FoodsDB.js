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
    
    if (!attrs.hasOwnProperty("timesUsed")) {
      attrs["timesUsed"] = [];
      attrs["images"] = [];
    }

    let found = false;
    for (let index in record.foods) {
      if (record.foods[index].id === attrs.id) {
        found = true;
        Object.assign(record.foods[index], attrs);
        record.foods[index].images = [];
        break;
      }
    }

    if (!found) {
      record.foods.push(attrs);
    }

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

  async updateTimesUsed(userID, foodID, time) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === userID);

    if (!record) { throw new Error(`Record with ID ${userID} not found`); }

    for (let index in record.foods) {
      if (record.foods[index].id === foodID) {
        record.foods[index].timesUsed.push(time);
        break;
      }
    }
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
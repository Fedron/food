const Database = require("./Database.js");

class TimeframesDB extends Database {
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

    let found = false;
    for (let index in record.timeframes) {
      if (record.timeframes[index].id === attrs.id) {
        found = true;
        Object.assign(record.timeframes[index], attrs);
        record.timeframes[index].images = [];
        break;
      }
    }

    if (!found) {
      record.timeframes.push(attrs);
    }

    await this.writeAll(records);
  }

  async delete(userID, timeframeID) {
    const records = await this.getAll();
    let record = records.find(r => r.id === userID);
    record.timeframes = record.timeframes.filter(r => r.id !== timeframeID);
    await this.writeAll(records);
  }
}

module.exports = new TimeframesDB("timeframes.json");
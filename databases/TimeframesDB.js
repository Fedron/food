const Database = require("./Database.js");

class TimeframesDB extends Database {
  async create(attrs) {
    attrs.id = this.randomID();

    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
    return attrs;
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) { throw new Error(`Record with ID ${id} not found`); }

    record.timeframes = attrs;
    await this.writeAll(records);
  }
}

module.exports = new TimeframesDB("timeframes.json");
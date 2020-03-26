const Database = require("./Database.js");

class TimeframesDB extends Database {
  async create(attrs) {
    attrs.id = this.randomID();

    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
    return attrs;
  }
}

module.exports = new TimeframesDB("timeframes.json");
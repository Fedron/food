const Database = require("./Database.js");

class TimeframesDB extends Database {}

module.exports = new TimeframesDB("timeframes.json");
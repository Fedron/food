import TimeframesDB from "../../../databases/TimeframesDB.js";

export default async (req, res) => {
  if (req.method === "get" || !req.query.user) {
    return res.send("Nono");
  } 

  const usersTimeframes = await TimeframesDB.get(req.query.user);
  res.setHeader("Content-Type", "application/json");
  res.send(usersTimeframes.timeframes)
}
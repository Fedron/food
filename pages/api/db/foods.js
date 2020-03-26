import FoodsDB from "../../../databases/FoodsDB.js";

export default async (req, res) => {
  if (req.method === "get" || !req.query.user) {
    return res.send("Nono");
  } 

  const usersFoods = await FoodsDB.get(req.query.user);
  res.setHeader("Content-Type", "application/json");
  res.send(usersFoods.foods)
}
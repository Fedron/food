import CategoriesDB from "../../../databases/CategoriesDB.js";

export default async (req, res) => {
  if (req.method === "get" || !req.query.user) {
    return res.send("Nono");
  } 

  const usersCategories = await CategoriesDB.get(req.query.user);
  res.setHeader("Content-Type", "application/json");
  res.send(usersCategories.categories)
}
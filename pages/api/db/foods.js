import FoodsDB from "../../../databases/FoodsDB.js";
import CategoriesDB from "../../../databases/CategoriesDB.js";
import { useFormControl } from "@material-ui/core";

export default async (req, res) => {
  if (req.method === "get" || !req.query.user) {
    return res.send("Nono");
  } 

  let usersFoods = await FoodsDB.get(req.query.user);
  for (let food of usersFoods.foods) {
    let newCategories = [];
    for (let category of food.categories) {
      const c = await CategoriesDB.getBy(req.query.user, { id: category });
      if (c === null) {
        newCategories.push("Deleted");
        continue;
      }

      newCategories.push(c.name);
    }
    food.categories = newCategories;
  }

  res.setHeader("Content-Type", "application/json");
  res.send(usersFoods.foods)
}
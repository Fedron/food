import PersistentDrawer from '../components/PersistentDrawer.js';
import FoodPicker from '../components/FoodPicker.js';
import 'isomorphic-fetch';

const Foods = ({ foods, categories, timeframes }) => {
  return (
    <PersistentDrawer>
      <FoodPicker foods={foods} categories={categories} timeframes={timeframes} />
    </PersistentDrawer>
  );
}

Foods.getInitialProps = async (ctx) => {
  let res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/foods?user=${ctx.req.session.userID}`);
  let foods = await res.json();

  res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/categories?user=${ctx.req.session.userID}`);
  const categories = await res.json();

  res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/timeframes?user=${ctx.req.session.userID}`);
  const timeframes = await res.json();

  return { foods, categories, timeframes };
}

export default Foods;
import PersistentDrawer from '../../components/PersistentDrawer.js';
import DatabaseEditor from '../../components/DatabaseEditor.js';
import FoodForm from '../../components/FoodForm.js';
import FoodItem from '../../components/FoodItem.js';
import 'isomorphic-fetch';

const Foods = ({ database, userCategories, userTimeframes }) => {
  return (
    <PersistentDrawer>
      <DatabaseEditor title={"food"} database={database} render={props => (
        <FoodForm {...props} userCategories={userCategories} userTimeframes={userTimeframes} />
      )} databaseItem={props => (
        <FoodItem {...props} />
      )} />
    </PersistentDrawer>
  );
}

Foods.getInitialProps = async (ctx) => {
  let res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/foods?user=${ctx.req.session.userID}`);
  let database = await res.json();

  res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/categories?user=${ctx.req.session.userID}`);
  const userCategories = await res.json();

  res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/timeframes?user=${ctx.req.session.userID}`);
  const userTimeframes = await res.json();

  return { database, userCategories, userTimeframes };
}

export default Foods;
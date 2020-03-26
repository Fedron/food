import PersistentDrawer from '../../components/PersistentDrawer.js';
import DatabaseEditor from '../../components/DatabaseEditor.js';
import FoodForm from '../../components/FoodForm.js';
import TimeframeItem from '../../components/TimeframeItem.js';
import 'isomorphic-fetch';

const Foods = ({ database }) => {
  return (
    <PersistentDrawer>
      <DatabaseEditor title={"food"} database={database} render={props => (
        <FoodForm {...props} />
      )} databaseItem={props => (
        <TimeframeItem {...props} />
      )} />
    </PersistentDrawer>
  );
}

Foods.getInitialProps = async (ctx) => {
  const res = await fetch(`http://localhost:3000/api/db/foods?user=${ctx.req.session.userID}`);
  const database = await res.json();

  return { database };
}

export default Foods;
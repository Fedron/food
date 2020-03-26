import PersistentDrawer from '../../components/PersistentDrawer.js';
import DatabaseEditor from '../../components/DatabaseEditor.js';
import CategoryForm from '../../components/CategoryForm.js';
import CategoryItem from '../../components/CategoryItem.js';
import 'isomorphic-fetch';

const Categories = ({ database }) => {
  return (
    <PersistentDrawer>
      <DatabaseEditor title={"category"} database={database} render={props => (
        <CategoryForm {...props} />
      )} databaseItem={props => (
        <CategoryItem {...props} />
      )} />
    </PersistentDrawer>
  );
}

Categories.getInitialProps = async (ctx) => {
  const res = await fetch(`http://localhost:3000/api/db/categories?user=${ctx.req.session.userID}`);
  const database = await res.json();

  return { database };
}

export default Categories;
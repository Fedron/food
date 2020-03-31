import PersistentDrawer from '../../components/PersistentDrawer.js';
import DatabaseEditor from '../../components/DatabaseEditor.js';
import TimeframeForm from '../../components/TimeframeForm.js';
import TimeframeItem from '../../components/TimeframeItem.js';
import 'isomorphic-fetch';

const Timeframes = ({ database }) => {
  return (
    <PersistentDrawer>
      <DatabaseEditor title={"timeframe"} database={database} render={props => (
        <TimeframeForm {...props} />
      )} databaseItem={props => (
        <TimeframeItem {...props} />
      )} />
    </PersistentDrawer>
  );
}

Timeframes.getInitialProps = async (ctx) => {
  const res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/timeframes?user=${ctx.req.session.userID}`);
  const database = await res.json();

  return { database };
}

export default Timeframes;
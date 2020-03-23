import PersistentDrawer from '../../components/PersistentDrawer.js';
import DatabaseEditor from '../../components/DatabaseEditor.js';

const Timeframes = () => {
  return (
    <PersistentDrawer>
      <DatabaseEditor title={"timeframe"} database={[
        {
          id: 1,
          name: "Quick",
          duration: "<30 min",
          color: "#4ad468"
        },
        {
          id: 2,
          name: "Short",
          duration: "<1 hour",
          color: "#e0e33b"
        },
        {
          id: 3,
          name: "Medium",
          duration: "<2 hours",
          color: "#f2a222"
        },
        {
          id: 4,
          name: "Long",
          duration: ">2 hours",
          color: "#f23a22"
        }
      ]} />
    </PersistentDrawer>
  );
}

export default Timeframes;
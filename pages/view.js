import PersistentDrawer from '../components/PersistentDrawer.js';
import 'isomorphic-fetch';

import { useTheme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  gridList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  }
}));

const Foods = ({ food, timeframes, categories }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <PersistentDrawer>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Paper style={{ padding: theme.spacing(2), marginBottom: theme.spacing(2) }}>  
          <Typography variant="h2" style={{ textAlign: "center" }}>{food.name}</Typography>
          <Typography variant="h4" style={{ textAlign: "center", margin: theme.spacing(1) }}>({timeframes.filter(t => t.id === food.timeframe)[0].duration})</Typography>
          <GridList className={classes.gridList} cols={2.5}>
            {food.images.map((image) => (
              <GridListTile key={image.name}>
                <img src={image.data} />
              </GridListTile>
            ))}
          </GridList>
          <div style={{ display: "flex", justifyContent: "center", margin: theme.spacing(1) }}>
            {food.categories.map(c => {
              const category = categories.filter(ci => ci.name === c)[0];
              return <Chip key={category.name} label={category.name} style={{ backgroundColor: category.color, margin: "4px" }} />;
            })}
          </div>
          <Typography><div dangerouslySetInnerHTML={{ __html: food.recipe }}></div></Typography>
        </Paper>
      </div>
    </PersistentDrawer>
  );
}

Foods.getInitialProps = async (ctx) => {
  let res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/foods?user=${ctx.req.session.userID}`);
  let foods = await res.json();
  const food = foods.filter(f => f.id = ctx.req.query.id)[0];

  res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/categories?user=${ctx.req.session.userID}`);
  const categories = await res.json();

  res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/timeframes?user=${ctx.req.session.userID}`);
  const timeframes = await res.json();

  return { food, categories, timeframes };
}

export default Foods;
import PersistentDrawer from '../components/PersistentDrawer.js';
import 'isomorphic-fetch';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const Foods = ({ foods }) => {
  return (
    <PersistentDrawer>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Typography style={{ marginBottom: "16px" }} variant="h3">Recently Picked Foods</Typography>
        {foods.map((food) => (
          <Paper
            key={food.id}
            style={{
              width: "100%",
              padding: "16px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h4">{food.name}</Typography>
              <Typography>{food.timesUsed}</Typography>
            </div>
            <a href={`/view?id=${food.id}`}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "100px", height: "100%" }}
              >View</Button>
            </a>
          </Paper>
        ))}
      </div>
    </PersistentDrawer>
  );
}

Foods.getInitialProps = async (ctx) => {
  let res = await fetch(`${ctx.req.protocol}://${ctx.req.get("host")}/api/db/foods?user=${ctx.req.session.userID}`);
  let foods = await res.json();

  const pickedFoods = foods.filter(f => f.timesUsed.length > 0);
  pickedFoods.sort((a, b) => {
    if (a.timesUsed[0] < b.timesUsed[0]) {
      return -1;
    }

    if (b.timesUsed[0] < a.timesUsed[0]) {
      return 1;
    }

    return 0;
  });

  pickedFoods.forEach(element => {
    const time = new Date(element.timesUsed[0]);
    const year = time.getFullYear();
    const month = time.toLocaleString('default', { month: 'long' });
    const date = time.getDate();

    console.log(date % 10);

    let suff = "";
    if (date > 3 && date < 21) suff = "th";
    switch (date % 10) {
      case 1:  suff = "st"; break;
      case 2:  suff = "nd"; break;
      case 3:  suff = "rd"; break;
      default: suff = "th"; break;
    }

    element.timesUsed = `${date}${suff} ${month} ${year}`;
  });

  return { foods: pickedFoods };
}

export default Foods;
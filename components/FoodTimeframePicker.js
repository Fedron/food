import React from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  categoryRoot: {
    display: 'flex',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    width: "100%"
  },
  button: {
    "&:hover": {
      filter: "brightness(80%)"
    }
  }
}));

const CustomCheckbox = withStyles({
  root: {
    color: "rgba(255, 255, 255, 0.75)",
    '&$checked': {
      color: "rgba(255, 255, 255, 0.9)",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const FoodTimeframePicker = ({ timeframes, selected, setPicker }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [selectedTimeframes, setSelectedTimeframes] = React.useState(
    timeframes.reduce((prev, cur) => {
      return {
        ...prev,
        [cur.id]: { ...cur, checked: Object.values(selected).indexOf(cur.id) > -1 ? true : false }
      };
    }, {})
  );

  const handleChange = (event) => {
    setSelectedTimeframes({
      ...selectedTimeframes,
      [event.target.name]: {
        ...selectedTimeframes[event.target.name],
        checked: event.target.checked
      }
    });
  };

  React.useEffect(() => {
    setPicker(Object.entries(selectedTimeframes).reduce((acc, cur) => {
      if (cur[1].checked) { return [...acc, cur[1].id] }
      return acc;
    }, []));
  }, [selectedTimeframes]);

  return (
    <div>
      <Paper className={classes.categoryRoot}>
        <Typography variant="h4" style={{ marginBottom: theme.spacing(2) }}>Choose some timeframes from below</Typography>
        <Typography variant="h5" style={{ marginBottom: theme.spacing(2) }}>(If you want any)</Typography>
        {timeframes.map(c => (
          <FormControlLabel
            key={c.id}
            control={
              <CustomCheckbox
                checked={selectedTimeframes[c.id].checked}
                onChange={handleChange}
                name={c.id}
              />
            }
            label={`${c.name} (${c.duration})`}
            style={{ backgroundColor: c.color, width: "100%", margin: 0 }}
          />
        ))}
      </Paper>
    </div>
  );
}
 
export default FoodTimeframePicker;
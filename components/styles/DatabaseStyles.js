import { makeStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const useStyles = makeStyles((theme) => ({
  db: {
    padding: theme.spacing(2),
    height: "100%",
  },
  dbView: {
    display: "flex",
    justifyContent: "space-between",
    height: "100%"
  },
  editOptions: {
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing(1),
    gridRowGap: theme.spacing(1)
  },
  dbItem: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 0,
    "&:hover": {
      filter: "brightness(90%)"
    }
  },
  dbItemActive: {
    outline: "3px solid black",
    zIndex: 10
  },
  dbItemRemoved: {
    textDecoration: "line-through",
    "&:hover": {
      textDecoration: "line-through"
    }
  },
  editor: {
    padding: theme.spacing(2),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    "& main": {
      display: "flex",
      flexDirection: "column",
      rowGap: theme.spacing(2),
      gridRowGap: theme.spacing(2)
    }
  },
  changeButtons: {
    marginBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "flex-end"
  },
  saveChangesButton: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    }
  },
  discardChangesButton: {
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  }
}));

export default useStyles
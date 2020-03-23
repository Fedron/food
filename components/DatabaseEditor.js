import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import uuid from 'uuid/v4';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import { Alert, AlertTitle } from '@material-ui/lab';
import { ChromePicker } from 'react-color';

import useStyles from './styles/DatabaseStyles.js';
import useFormInput from '../hooks/useFormInput.js';

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

const DatabaseEditor = ({ title, database }) => {
  const classes = useStyles();
  const theme = useTheme();

  // State
  const [activeTimeframe, setActiveTimeframe] = useState("");
  const [timeframeName, handleTimeframeName,, setTimeframeName] = useFormInput("");
  const [timeframeDur, handleTimeframeDur,, setTimeframeDur] = useFormInput("");
  const [timeframeColor, setTimeframeColor] = useState("");

  const [newTimeframeName, handleNewTimeframeName,, setNewTimeframeName] = useFormInput("");
  const [newTimeframeDur, handleNewTimeframeDur,, setNewTimeframeDur] = useFormInput("");
  const [newTimeframeColor, setNewTimeframeColor] = useState("");

  const [errors, setErrors] = useState({});

  const [newDatabase, setDatabase] = useState(database);
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreating, setCreating] = useState(false);

  // Funcs
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    setTimeframeName(activeTimeframe.name);
    setTimeframeDur(activeTimeframe.duration);
    setTimeframeColor(activeTimeframe.color);
  }, [activeTimeframe, hasChanges]);

  const updateTimeframe = () => {
    const updatedErrors = {}
    if (!timeframeName) {
      updatedErrors.name = "Cannot leave blank";
    }

    if (!timeframeDur) {
      updatedErrors.duration = "Cannot leave blank"
    }

    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length > 0) {
      return;
    }

    const updated = newDatabase;
    const recordToUpdate = updated.find(item => item.id === activeTimeframe.id);
    recordToUpdate.name = timeframeName;
    recordToUpdate.duration = timeframeDur;
    recordToUpdate.color = timeframeColor.hex ? timeframeColor.hex : timeframeColor;
    recordToUpdate.changed = true;

    setDatabase(updated);
    setHasChanges(true);
  }

  const createNewTimeframe = () => {
    const updatedErrors = {}
    if (!newTimeframeName) {
      updatedErrors.name = "Cannot leave blank";
    }

    if (!newTimeframeDur) {
      updatedErrors.duration = "Cannot leave blank"
    }

    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length > 0) {
      return;
    }

    setDatabase([...database, {
      id: uuid(),
      name: newTimeframeName,
      duration: newTimeframeDur,
      color: newTimeframeColor.hex,
      new: true
    }]);
    setHasChanges(true);
  }

  const renderedDatabase = newDatabase.map(item =>
    <Button
      key={item.id}
      className={clsx(
        classes.dbItem,
        (item.id === activeTimeframe.id) && classes.dbItemActive,
        item.removed && classes.dbItemRemoved
      )}
      style={{ backgroundColor: item.color }}
      onClick={() => {
        if (item.removed) { return; }
        setCreating(false);
        setActiveTimeframe(item);
      }}
    >
      <Typography>{item.name} - ({item.duration})</Typography>  
      {item.removed ?
        <Typography style={{ fontWeight: "bold", color: "white" }}>* Removed</Typography>
        : item.new ?
          <Typography style={{ fontWeight: "bold", color: "white" }}>* New</Typography>
          : ( item.changed &&
          <Typography style={{ fontWeight: "bold", color: "white" }}>* Changed</Typography>)
      }
    </Button>
  );

  return (
    <>
    {hasChanges &&
      <Alert severity="error" style={{ marginBottom: theme.spacing(2) }}>
        <AlertTitle>Unsaved Changes</AlertTitle>
        You've made some changes to your {title}s database, if you don't save they will be lost.
      </Alert>
    }
    <div className={classes.changeButtons}>
      <Button
        variant="contained"
        color="primary"
        className={classes.discardChangesButton}
        style={{ marginRight: theme.spacing(2) }}
      >Discard Changes</Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.saveChangesButton}
      >Save Changes</Button>
    </div>
    <Grid container spacing={4} >
      <Grid item xs={12} sm={6} >
        <Paper className={classes.db}>
          <div className={classes.dbView}>
            <Paper elevation={0} variant="outlined" style={{ flexGrow: 1, marginRight: theme.spacing(2) }}>
              {renderedDatabase}
              <Button className={classes.dbItem} style={{ marginTop: theme.spacing(2) }} onClick={() => {
                setCreating(true);
              }}>
                <Typography><i className="fas fa-plus"></i> Add new</Typography>  
              </Button>
            </Paper>
            <div className={classes.editOptions}>
              <Button onClick={() => {
                setCreating(true);
              }}><Icon className="fas fa-plus" /></Button>
              <Button onClick={() => {
                if (activeTimeframe) {
                  const updated = newDatabase;
                  const recordToUpdate = updated.find(item => item.id === activeTimeframe.id);
                  recordToUpdate.removed = true;

                  setActiveTimeframe("");
                  setHasChanges(true);
                }
              }}><Icon className="fas fa-times" /></Button>
            </div>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper className={classes.editor}>
          {(activeTimeframe || isCreating) ?
          <>
            <Typography
              variant="h2"
              style={{ marginBottom: theme.spacing(2) }}
            >
              {isCreating ?
              `Create new ${title}`
              :
              `Edit '${activeTimeframe.name}' ${title}`
              }
            </Typography>
            <main style={{ width: "50%" }}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Name of timeframe"
                name="name"
                value={isCreating ? newTimeframeName : timeframeName}
                onChange={isCreating ? handleNewTimeframeName : handleTimeframeName}
              />
              {errors.name &&
              <Typography color="error">{errors.name}</Typography>
              }
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="duration"
                label="Estimated time e.g <2 hours"
                name="duration"
                value={isCreating ? newTimeframeDur : timeframeDur}
                onChange={isCreating ? handleNewTimeframeDur : handleTimeframeDur}
              />
              {errors.duration &&
              <Typography color="error">{errors.duration}</Typography>
              }
              <ChromePicker
                width="100%"
                color={isCreating ? newTimeframeColor : timeframeColor}
                onChange={isCreating ? setNewTimeframeColor : setTimeframeColor}
              />
              <Button
                onClick={isCreating ? createNewTimeframe : updateTimeframe}
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: theme.spacing(1, 0) }}
              >
                {isCreating ? "Create" : "Submit"}
              </Button>
            </main>
          </>
          :
          <>
            <Typography variant="h3">
              Select a {title} on the left to start editing
            </Typography>
            <Typography variant="h4">Or</Typography>
            <Typography variant="h3">Add a new {title}</Typography>
          </>
          }
        </Paper>
      </Grid>
    </Grid>
    </>
  );
}
 
export default DatabaseEditor;

import React, { useState, } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { Alert, AlertTitle } from '@material-ui/lab';
import useStyles from './styles/DatabaseStyles.js';
import 'isomorphic-fetch';

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

const DatabaseEditor = ({ title, database, render, currentUrl }) => {
  const classes = useStyles();
  const theme = useTheme();

  // State
  const [activeTimeframe, setActiveTimeframe] = useState("");

  const [newDatabase, setDatabase] = useState(database);
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreating, setCreating] = useState(false);

  const [saveNotification, setSaveNotification] = useState(undefined);
  const forceUpdate = useForceUpdate();

  const updateDB = (newRecord) => {
    setHasChanges(true);

    const updatedDatabase = newDatabase;
    let recordToUpdate = updatedDatabase.find(item => item.id === newRecord.id);
    if (!recordToUpdate) {
      setDatabase([...newDatabase, newRecord]);
      return
    }

    recordToUpdate = newRecord;
    setDatabase([...updatedDatabase]);
  }

  const saveChanges = () => {
    let updatedDatabase = newDatabase;
    for (let record of updatedDatabase) {
      if (record.removed) {
        updatedDatabase = updatedDatabase.filter(r => r.id !== record.id);
        continue;
      }

      delete record["new"];
      delete record["changed"];
    }

    setDatabase(updatedDatabase);

    fetch("/db/timeframes/save", {
      method: "post",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedDatabase)
    }).then((res) => {
      if (res.status === 200) {
        setActiveTimeframe("");
        setCreating(false);
        setHasChanges(false);
        setSaveNotification(
            <Alert
              severity="success"
              style={{ marginBottom: theme.spacing(2) }}
              action={
                <IconButton color="inherit" size="small" onClick={() => { setSaveNotification(undefined); }}>
                  <CloseIcon />
                </IconButton>
              }
            >
              <AlertTitle>Changes Saved!</AlertTitle>
              All your changes were saved!
            </Alert>
        );
      } else {
        setSaveNotification(
          <Alert severity="error" style={{ marginBottom: theme.spacing(2) }}>
            <AlertTitle>Couldn't save changes</AlertTitle>
            Something went horribly wrong on the server and your changes couldn't be saved.
          </Alert>
        );
      }
    });
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
      disabled={item.removed}
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
    {saveNotification}
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
        onClick={() => {
          const updatedDatabase = newDatabase;
          updatedDatabase.forEach((record, index) => {
            if (record["new"] && index > -1) {
              this.splice(index, 1);
              return;
            }
            
            delete record["changed"];
            delete record["removed"];
          }, updatedDatabase);

          setDatabase(updatedDatabase);
          setHasChanges(false);
          forceUpdate();
        }}
      >Discard Changes</Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.saveChangesButton}
        disabled={!hasChanges}
        onClick={saveChanges}
      >Save Changes</Button>
    </div>
    <Grid container spacing={4} >
      <Grid item xs={12} sm={6} >
        <Paper className={classes.db}>
          <div className={classes.dbView}>
            <Paper elevation={0} variant="outlined" style={{ flexGrow: 1, marginRight: theme.spacing(2) }}>
              {renderedDatabase}
              <Button className={classes.dbItem} style={{ marginTop: theme.spacing(2), justifyContent: "center" }} onClick={() => {
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
          render({
            isCreating,
            updateDB,
            activeTimeframe
          })
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

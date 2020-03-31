import React, { useState, } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Alert, AlertTitle } from '@material-ui/lab';
import useStyles from './styles/DatabaseStyles.js';
import 'isomorphic-fetch';

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

const DatabaseEditor = ({ title, database, render, databaseItem }) => {
  const classes = useStyles();
  const theme = useTheme();

  // State
  const [activeItem, setActiveItem] = useState("");

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
      return;
    }

    recordToUpdate = newRecord;
    setDatabase([...updatedDatabase]);
  }

  const saveChanges = async () => {
    let updatedDatabase = newDatabase;
    for (let record of updatedDatabase) {
      if (record.removed) {
        updatedDatabase = updatedDatabase.filter(r => r.id !== record.id);
        await fetch(`/db/${title}s/delete`, {
          method: "post",
          headers: {
            "Accept": "application/json, text/plan, */*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: record.id })
        })
        continue;
      }

      if (record["new"] || record["changed"]) {
        delete record["new"];
        delete record["changed"];

        if (title !== "food") {
          console.log(`Saving ${record.name}`);
          fetch(`/db/${title}s/save`, {
            method: "post",
            headers: {
              "Accept": "application/json, text/plan, */*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
          }).then((res) => {
            if (res.status === 200) {
              setActiveItem("");
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
        } else {
          const images = record.images;
          delete record["images"];
          await fetch(`/db/foods/save`, {
            method: "post",
            headers: {
              "Accept": "application/json, text/plan, */*",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
          });

          for (let image of images) {
            await fetch(`/db/foods/image/save`, {
              method: "post",
              headers: {
                "Accept": "application/json, text/plan, */*",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ id: record.id, ...image })
            });
          }

          setActiveItem("");
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
        }
      }
    }

    setDatabase(updatedDatabase);
    setHasChanges(false);
  }

  const renderedDatabase = newDatabase.map(item =>
    <Button
      key={item.id}
      className={clsx(
        classes.dbItem,
        (item.id === activeItem.id) && classes.dbItemActive,
        item.removed && classes.dbItemRemoved
      )}
      style={{ backgroundColor: item.color ? item.color : "#fff" }}
      onClick={() => {
        if (item.removed) { return; }
        setCreating(false);
        setActiveItem(item);
      }}
      disabled={item.removed}
    >
      {databaseItem({ item })}
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
              updatedDatabase.splice(index, 1);
              return;
            }
            
            delete record["changed"];
            delete record["removed"];
          });

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
                if (activeItem) {
                  const updated = newDatabase;
                  const recordToUpdate = updated.find(item => item.id === activeItem.id);
                  recordToUpdate.removed = true;

                  setActiveItem("");
                  setHasChanges(true);
                }
              }}><Icon className="fas fa-times" /></Button>
            </div>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper className={classes.editor}>
          {(activeItem || isCreating) ?
          render({
            isCreating,
            updateDB,
            activeItem
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

import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { ChromePicker } from 'react-color';
import useFormInput from '../hooks/useFormInput.js';

const TimeframeForm = ({
  isCreating,
  updateDB,
  activeTimeframe
}) => {
  const theme = useTheme();

  const [timeframeName, handleTimeframeName,, setTimeframeName] = useFormInput("");
  const [timeframeDur, handleTimeframeDur,, setTimeframeDur] = useFormInput("");
  const [timeframeColor, setTimeframeColor] = useState("");

  const [newTimeframeName, handleNewTimeframeName,, setNewTimeframeName] = useFormInput("");
  const [newTimeframeDur, handleNewTimeframeDur,, setNewTimeframeDur] = useFormInput("");
  const [newTimeframeColor, setNewTimeframeColor] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTimeframeName(activeTimeframe.name);
    setTimeframeDur(activeTimeframe.duration);
    setTimeframeColor(activeTimeframe.color);
  }, [activeTimeframe]);

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

    activeTimeframe.name = timeframeName;
    activeTimeframe.duration = timeframeDur;
    activeTimeframe.color = timeframeColor.hex ? timeframeColor.hex : timeframeColor;
    activeTimeframe.changed = true;

    updateDB(activeTimeframe);
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

    updateDB({
      id: uuid(),
      name: newTimeframeName,
      duration: newTimeframeDur,
      color: newTimeframeColor.hex,
      new: true
    });

    setNewTimeframeName("");
    setNewTimeframeDur("");
    setNewTimeframeColor('#'+Math.random().toString(16).substr(-6));
  }

  return (
    <>
    <Typography
      variant="h2"
      style={{ marginBottom: theme.spacing(2) }}
    >
      {isCreating ?
      `Create new timeframe`
      :
      `Edit '${activeTimeframe.name}' timeframe`
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
  );
}
 
export default TimeframeForm;
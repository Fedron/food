import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';

import FoodCategoryPicker from './FoodCategoryPicker.js';
import FoodTimeframePicker from './FoodTimeframePicker.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructionsRoot: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "100%"
  },
  gridList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  pickerButton: {
    margin: theme.spacing(1),
    width: "100%"
  },
  rejectPickerButton: {
    color: "white",
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  },
  confirmPickerButton: {
    color: "white",
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    }
  }
}));


function getSteps() {
  return ['Select categories', 'Add timeframe(s)'];
}

function getStepContent(step, categories, selectedCategories, setCategories, timeframes, selectedTimeframes, setTimeframes) {
  switch (step) {
    case 0:
      return <FoodCategoryPicker categories={categories} selected={selectedCategories} setPicker={setCategories} />;
    case 1:
      return <FoodTimeframePicker timeframes={timeframes} selected={selectedTimeframes} setPicker={setTimeframes} />;
    default:
      return 'Unknown step';
  }
}

function useForceUpdate(){
  const [value, setValue] = React.useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

const FoodPicker = ({ foods, categories, timeframes }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [selectedTimeframes, setSelectedTimeframes] = React.useState([]);

  const [pickedFood, setPickedFood] = React.useState("");
  const [alertMsg, setAlertMsg] = React.useState("");
  const [foodConfirmed, setFoodConfirmed] = React.useState(false);
  const forceUpdate = useForceUpdate();
  
  const totalSteps = () => {
    return getSteps().length;
  };

  const isStepOptional = (step) => {
    return step === 0 || step === 1;
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const skippedSteps = () => {
    return skipped.size;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    const isFinished = completedSteps() === totalSteps() - skippedSteps();
    if (!isFinished) { return false; }
    if (pickedFood) { return true; }

    let filteredFoods = foods.filter((food) => {
      if (food.categories.some(c => selectedCategories.includes(c))) {
        if (selectedTimeframes.includes(food.timeframe)) { return true; }
      }
      return false;
    });

    if (filteredFoods.length === 0) {
      setAlertMsg("No foods were found with your preferences, please choose something else");
      handleReset();
    }

    filteredFoods.sort((a, b) => {
      if (a === [] || b === []) { return -1; }
      if (a[0] < b[0]) { return -1; }
      if (a[0] > b[0]) { return 1; }
      return 0;
    })

    filteredFoods = filteredFoods.slice(0, 4);
    const chosenFood = filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
    setPickedFood(chosenFood);
    return true;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
          // find the first step that has been completed
          steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
    if (allStepsCompleted()) {
      forceUpdate();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext();
    }

    if (allStepsCompleted()) {
      forceUpdate();
    }
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedTimeframes([]);
    setPickedFood("");
    setActiveStep(0);
    setCompleted(new Set());
    setSkipped(new Set());
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  function isStepComplete(step) {
    return completed.has(step);
  }

  allStepsCompleted();

  return (
    pickedFood ? (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h4" style={{ marginBottom: theme.spacing(2) }}>Here's your picked food</Typography>
        <Paper style={{ padding: theme.spacing(2), marginBottom: theme.spacing(2) }}>  
          <Typography variant="h2" style={{ textAlign: "center" }}>{pickedFood.name}</Typography>
          <Typography variant="h4" style={{ textAlign: "center", margin: theme.spacing(1) }}>({timeframes.filter(t => t.id === pickedFood.timeframe)[0].duration})</Typography>
          <GridList className={classes.gridList} cols={2.5}>
            {pickedFood.images.map((image) => (
              <GridListTile key={image.name}>
                <img src={image.data} />
              </GridListTile>
            ))}
          </GridList>
          <div style={{ display: "flex", justifyContent: "center", margin: theme.spacing(1) }}>
            {pickedFood.categories.map(c => {
              const category = categories.filter(ci => ci.name === c)[0];
              return <Chip key={category.name} label={category.name} style={{ backgroundColor: category.color, margin: "4px" }} />;
            })}
          </div>
          <Typography><div dangerouslySetInnerHTML={{ __html: pickedFood.recipe }}></div></Typography>
        </Paper>
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}>
          {foodConfirmed ?
            <Typography variant="h4" style={{ color: green[500] }}><Icon className="fas fa-check" /> Food picked!</Typography>
            :
            <>
            <Button
              className={`${classes.pickerButton} ${classes.rejectPickerButton}`}
              variant="contained"
              color="primary"
              onClick={() => {
                handleReset();
              }}
            ><Icon className="fas fa-times" /> Reject</Button>
            <Button
              className={`${classes.pickerButton} ${classes.confirmPickerButton}`}
              variant="contained"
              color="secondary"
              onClick={() => {
                setFoodConfirmed(true);
              }}
            ><Icon className="fas fa-check" /> Confirm</Button>
            </>
          }
        </div> 
      </div>
    ) : (
      <div className={classes.root}>
        {alertMsg && (
          <Collapse in={alertMsg ? true : false}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => { setAlertMsg(""); }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >{alertMsg}</Alert>
          </Collapse>
        )}
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const buttonProps = {};
            if (isStepOptional(index)) {
              buttonProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepButton
                  onClick={handleStep(index)}
                  completed={isStepComplete(index)}
                  {...buttonProps}
                >
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        <div className={classes.instructionsRoot}>
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(
                activeStep,
                categories,
                selectedCategories,
                setSelectedCategories,
                timeframes,
                selectedTimeframes,
                setSelectedTimeframes
              )}
            </Typography>
            <div style={{ width: "100%" }}>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  Next
                </Button>
              {isStepOptional(activeStep) && !completed.has(activeStep) && activeStep !== 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              {activeStep !== steps.length &&
                (completed.has(activeStep) ? (
                  <Typography variant="caption" className={classes.completed}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Confirm'}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
 
export default FoodPicker;
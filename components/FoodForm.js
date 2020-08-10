import React, { useState, useEffect, useRef } from 'react';
import uuid from 'uuid/v4';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MultipleSelect } from 'react-select-material-ui';
import useFormInput from '../hooks/useFormInput.js';
import RichTextEditor from './RichTextEditor.js';
import 'isomorphic-fetch';
import { render } from 'react-dom';

const useStyles = makeStyles((theme) => ({
  foodImage: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& img": {
      marginRight: theme.spacing(4)
    }
  }
}));

const FoodForm = ({
  isCreating,
  updateDB,
  activeItem,
  userCategories,
  userTimeframes
}) => {
  const classes = useStyles();
  const theme = useTheme();
  userCategories = userCategories.map(c => c.name);

  const [foodName, handleFoodName,, setFoodName] = useFormInput("");
  const [foodImages, setFoodImages] = useState([]);

  const [foodRecipe, setFoodRecipe] = useState("");
  const [recipeEditorOpen, setRecipeEditorOpen] = useState(false);

  // const [newFoodName, handleNewFoodName,, setNewFoodName] = useFormInput("");
  // const [newFoodImages, setNewFoodImages] = useState([]);

  const [foodCategories, setFoodCategories] = useState([]);
  const [foodTimeframe, setFoodTimeframe] = useState("");
  const handleFoodTimeframe = (e) => {
    setFoodTimeframe(e.target.value);
  }

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (activeItem === -1) {
      setFoodName("");
      setFoodRecipe("");
      setFoodImages([]);
      setFoodCategories([]);
      setFoodTimeframe("");
      setErrors({});
      return;
    }
    setFoodName(activeItem.name);
    setFoodRecipe(activeItem.recipe);
    setFoodImages(activeItem.images);
    setFoodCategories(activeItem.categories);
    setFoodTimeframe(activeItem.timeframe);
    setErrors({});
  }, [activeItem]);

  const updateFood = () => {
    const updatedErrors = {}
    if (!foodName) {
      updatedErrors.name = "Cannot leave blank";
    }

    if (!foodImages.length) {
      updatedErrors.images = "Please add at least one image";
    }

    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length > 0) {
      return;
    }

    activeItem.name = foodName;
    activeItem.recipe = foodRecipe;
    activeItem.categories = foodCategories;
    activeItem.timeframe = foodTimeframe;
    activeItem.images = foodImages;
    activeItem.changed = true;

    updateDB(activeItem);
  }

  const createNewFood = () => {
    const updatedErrors = {}
    if (!foodName) {
      updatedErrors.name = "Cannot leave blank";
    }

    if (!foodImages.length) {
      updatedErrors.images = "Please add at least one image";
    }

    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length > 0) {
      return;
    }

    updateDB({
      id: uuid(),
      name: foodName,
      recipe: foodRecipe,
      images: foodImages,
      categories: foodCategories,
      timeframe: foodTimeframe,
      new: true
    });

    setFoodName("");
    setFoodRecipe("");
    setFoodImages([]);
    setFoodCategories([]);
    setFoodTimeframe("");
  }

  let renderedFoodImages;
  if (!foodImages) {
    renderedFoodImages = [];
  } else {
    renderedFoodImages = foodImages.map(food => <Card key={food.name}><CardContent>
        <div className={classes.foodImage}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={`${food.data}`} height="100" />
            <Typography variant="h5">{food.name}</Typography>
          </div>  
          <IconButton
            className="fas fa-times"
            onClick={() => {
              setFoodImages(foodImages.filter(f => f.name !== food.name));
            }}
          />
        </div>
        </CardContent></Card>
    );
  }

  return (
    <div style={{ width: "100%" }}>
    <Typography
      variant="h2"
      style={{ marginBottom: theme.spacing(2) }}
    >
      {isCreating ?
      `Create new food`
      :
      `Edit '${activeItem.name}' food`
      }
    </Typography>
    <main style={{ width: "80%", margin: "0 auto" }}>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="name"
        label="Name of food"
        name="name"
        value={foodName}
        onChange={handleFoodName}
      />
      {errors.name &&
      <Typography color="error">{errors.name}</Typography>
      }

      <div style={{ display: "flex" }}>
        <Typography variant="h5" style={{ marginRight: theme.spacing(4) }}>Recipe</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { setRecipeEditorOpen(true); }}
        >
          Open editor
        </Button>
      </div>
      <Dialog 
        open={recipeEditorOpen}
        onClose={() => { setRecipeEditorOpen(false); }}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Recipe Editor</DialogTitle>
        <DialogContent>
          <RichTextEditor
            data={foodRecipe}
            onChange={(event, editor) => {
              setFoodRecipe(editor.getData());
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            style={{ backgroundColor: theme.palette.error.main, color: "white" }}
            onClick={() => {
              setRecipeEditorOpen(false);
              setFoodRecipe("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setRecipeEditorOpen(false); }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <MultipleSelect
        label="Choose some categories"
        values={foodCategories}
        options={userCategories}
        helperText="You can add a new category by writing its name and pressing enter!"
        onChange={setFoodCategories}
        SelectProps={{
          msgNoOptionsAvailable: "All categories have been selected",
          msgNoOptionsMatchFilter: "No category with that name found"
        }}
      />

      <FormControl>
        <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
        <Select
          labelId="timeframe-select-label"
          id="timeframe-select"
          value={foodTimeframe}
          onChange={handleFoodTimeframe}
        >
          {userTimeframes.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.name} ({t.duration})</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h5">Choose some images</Typography>
      <input type="file" onChange={(e) => {
        if (e.target.files[0].size > 115343360) {
          setErrors({ ...errors, images: "Images must be smaller than 10MB" });
          return;
        }
        setErrors({ ...errors, images: "" });

        const newImage = {
          name: e.target.files[0].name
        }

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function(evt) {
          newImage["data"] = evt.target.result;
          setFoodImages([...foodImages, newImage]);
        }
      }} />
      {errors.images &&
      <Typography color="error">{errors.images}</Typography>
      }
      {renderedFoodImages}

      <Button
        onClick={isCreating ? createNewFood : updateFood}
        fullWidth
        variant="contained"
        color="primary"
        style={{ margin: theme.spacing(1, 0) }}
      >
        {isCreating ? "Create" : "Submit"}
      </Button>
    </main>
    </div>
  );
}
 
export default FoodForm;
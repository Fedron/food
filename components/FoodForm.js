import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import useFormInput from '../hooks/useFormInput.js';

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
  activeItem
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const [foodName, handleFoodName,, setFoodName] = useFormInput("");
  const [foodRecipe, handleFoodRecipe,, setFoodRecipe] = useFormInput("");

  const [newFoodName, handleNewFoodName,, setNewFoodName] = useFormInput("");
  const [newFoodRecipe, handleNewFoodRecipe,, setNewFoodRecipe] = useFormInput("");
  const [newFoodImages, setNewFoodImages] = useState([]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFoodName(activeItem.name);
  }, [activeItem]);

  const updateFood = () => {
    const updatedErrors = {}
    if (!foodName) {
      updatedErrors.name = "Cannot leave blank";
    }

    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length > 0) {
      return;
    }

    activeItem.name = foodName;
    activeItem.changed = true;

    updateDB(activeItem);
  }

  const createNewFood = () => {
    const updatedErrors = {}
    if (!newFoodName) {
      updatedErrors.name = "Cannot leave blank";
    }

    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length > 0) {
      return;
    }

    updateDB({
      id: uuid(),
      name: newFoodName,
      recipe: newFoodRecipe,
      new: true
    });

    setNewFoodName("");
  }

  const renderedNewFoodImages = newFoodImages.map(food => <Card><CardContent>
    <div key={food.name} className={classes.foodImage}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={`${food.data}`} height="100" />
        <Typography variant="h5">{food.name}</Typography>
      </div>  
      <IconButton
        className="fas fa-times"
        onClick={() => {
          setNewFoodImages(newFoodImages.filter(f => f.name !== food.name));
        }}
      />
    </div>
    </CardContent></Card>
  );

  return (
    <>
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
    <main style={{ width: "50%" }}>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="name"
        label="Name of food"
        name="name"
        value={isCreating ? newFoodName : foodName}
        onChange={isCreating ? handleNewFoodName : handleFoodName}
      />
      {errors.name &&
      <Typography color="error">{errors.name}</Typography>
      }

      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="recipe"
        label="Link to recipe"
        name="recipe"
        value={isCreating ? newFoodRecipe : foodRecipe}
        onChange={isCreating ? handleNewFoodRecipe : handleFoodRecipe}
      />
      {errors.recipe &&
      <Typography color="error">{errors.recipe}</Typography>
      }

      <input type="file" onChange={(e) => {
        const newImage = {
          name: e.target.files[0].name
        }

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function(evt) {
          newImage["data"] = evt.target.result;
          setNewFoodImages([...newFoodImages, newImage]);
        }
      }} />
      {renderedNewFoodImages}

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
    </>
  );
}
 
export default FoodForm;
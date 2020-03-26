import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { ChromePicker } from 'react-color';
import useFormInput from '../hooks/useFormInput.js';

const CategoryForm = ({
  isCreating,
  updateDB,
  activeItem
}) => {
  const theme = useTheme();

  const [categoryName, handleCategoryName,, setCategoryName] = useFormInput("");
  const [categoryColor, setCategoryColor] = useState("");

  const [newCategoryName, handleNewCategoryName,, setNewCategoryName] = useFormInput("");
  const [newCategoryColor, setNewCategoryColor] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCategoryName(activeItem.name);
    setCategoryColor(activeItem.color);
  }, [activeItem]);

  const updateCategory = () => {
    const updatedErrors = {}
    if (!categoryName) {
      updatedErrors.name = "Cannot leave blank";
    }

    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length > 0) {
      return;
    }

    activeItem.name = categoryName;
    activeItem.color = categoryColor.hex ? categoryColor.hex : categoryColor;
    activeItem.changed = true;

    updateDB(activeItem);
  }

  const createNewCategory = () => {
    const updatedErrors = {}
    if (!newCategoryName) {
      updatedErrors.name = "Cannot leave blank";
    }

    setErrors(updatedErrors);

    if (Object.keys(updatedErrors).length > 0) {
      return;
    }

    updateDB({
      id: uuid(),
      name: newCategoryName,
      color: newCategoryColor.hex,
      new: true
    });

    setNewCategoryName("");
    setNewCategoryColor('#'+Math.random().toString(16).substr(-6));
  }

  return (
    <>
    <Typography
      variant="h2"
      style={{ marginBottom: theme.spacing(2) }}
    >
      {isCreating ?
      `Create new category`
      :
      `Edit '${activeItem.name}' category`
      }
    </Typography>
    <main style={{ width: "50%" }}>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="name"
        label="Name of category"
        name="name"
        value={isCreating ? newCategoryName : categoryName}
        onChange={isCreating ? handleNewCategoryName : handleCategoryName}
      />
      {errors.name &&
      <Typography color="error">{errors.name}</Typography>
      }
      <ChromePicker
        width="100%"
        color={isCreating ? newCategoryColor : categoryColor}
        onChange={isCreating ? setNewCategoryColor : setCategoryColor}
      />
      <Button
        onClick={isCreating ? createNewCategory : updateCategory}
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
 
export default CategoryForm;
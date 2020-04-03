import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { useTheme } from '@material-ui/core/styles';

const FoodItem = ({ item }) => {
  const theme = useTheme();

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid rgba(0, 0, 0, 0.2)"
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {item.images &&
        <img src={`${item.images[0].data}`} height="100" style={{ margin: "4px", marginRight: "16px" }} />
        }
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography variant="h4">{item.name}</Typography>
          <div style={{ display: "flex" }}>
            {item.categories.map(category => (
              <Chip key={category} label={category} style={{ marginRight: theme.spacing(1) }} />
            ))}
          </div>    
        </div>
      </div>
      {item.removed ?
        <Typography variant="h5" style={{ fontWeight: "bold" }}>* Removed</Typography>
        : item.new ?
          <Typography variant="h5" style={{ fontWeight: "bold" }}>* New</Typography>
          : ( item.changed &&
          <Typography variant="h5" style={{ fontWeight: "bold" }}>* Changed</Typography>)
        }
    </div>
  );
}
 
export default FoodItem;
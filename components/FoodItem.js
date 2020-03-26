import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const FoodItem = ({ item }) => {
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
      <img src={`${item.images[0].data}`} height="100" style={{ margin: "4px", marginRight: "16px" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Typography variant="h4">{item.name}</Typography>
        <Link href={`${item.recipe}`} onClick={(e) => {e.stopPropagation()}} target="_blank" rel="noopener">{item.recipe}</Link>
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
import React from 'react';
import Typography from '@material-ui/core/Typography';

const TimeframeItem = ({ item }) => {
  return (
    <>
    <Typography>{item.name} - ({item.duration})</Typography>  
    {item.removed ?
      <Typography style={{ fontWeight: "bold", color: "white" }}>* Removed</Typography>
      : item.new ?
        <Typography style={{ fontWeight: "bold", color: "white" }}>* New</Typography>
        : ( item.changed &&
        <Typography style={{ fontWeight: "bold", color: "white" }}>* Changed</Typography>)
    }
    </>
  );
}
 
export default TimeframeItem;
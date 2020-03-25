import React, { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Icon from '@material-ui/core/Icon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import useStyles from './styles/PersistentDrawerStyles.js';

const PersistentDrawer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton edge="start" className={clsx(classes.menuButton, open && classes.hide)} color="inherit" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" className={classes.title}>Food App</Typography>
          <Button color="inherit">
            <Link href="/signout">
              <a className={classes.signOut}><i className="fas fa-sign-out-alt"></i> Sign Out</a>
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button >
            <Icon className="fas fa-chart-line" style={{ marginRight: theme.spacing(4) }} />
            <ListItemText>
              <Link href="/"><a>Dashboard</a></Link>
            </ListItemText>
          </ListItem>
          <ListItem button >
            <Icon className="fas fa-mitten" style={{ marginRight: theme.spacing(4) }} />
            <ListItemText>
              <Link href="/food"><a>Food Picker</a></Link>
            </ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button >
            <Icon className="fas fa-carrot" style={{ marginRight: theme.spacing(4) }} />
            <ListItemText>
              <Link href="/db/food"><a>Foods Database</a></Link>
            </ListItemText>
          </ListItem>
          <ListItem button >
            <Icon className="fas fa-book" style={{ marginRight: theme.spacing(4) }} />
            <ListItemText>
              <Link href="/db/catergory"><a>Catergories Database</a></Link>
            </ListItemText>
          </ListItem>
          <ListItem button >
            <Icon className="fas fa-stopwatch" style={{ marginRight: theme.spacing(4) }} />
            <ListItemText>
              <Link href="/db/timeframes"><a>Timeframes Database</a></Link>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
         {props.children}
      </main>
    </div>
  );
}
 
export default PersistentDrawer;
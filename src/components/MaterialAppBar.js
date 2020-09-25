import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    alignItems: 'center',
    'box-shadow': '0 3px 5px rgba(0,0,0,.01)',
    background : '#B8F28A'
  },
  typography: {
    color: '#58a700',
    fontWeight: '700'
  }
}));

export default function MaterialAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar variant="regular">
          <Typography className={classes.typography} variant="h5">
            Smart Goals
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
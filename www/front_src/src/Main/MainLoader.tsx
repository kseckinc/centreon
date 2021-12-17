import * as React from 'react';

import { Fade, makeStyles, Typography } from '@material-ui/core';

import logoCentreon from '../Navigation/Sidebar/Logo/centreon.png';

import { labelCentreonIsLoading } from './translatedLabels';

const useStyles = makeStyles((theme) => ({
  loader: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'center',
    rowGap: theme.spacing(2),
    width: '100%',
  },
}));

interface Props {
  allowTransition?: boolean;
}

const MainLoader = ({ allowTransition = false }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.loader}>
      <Fade in={allowTransition}>
        <div>
          <img alt="Centreon Logo" src={logoCentreon} />
          <Typography>{labelCentreonIsLoading}</Typography>
        </div>
      </Fade>
    </div>
  );
};

export default MainLoader;

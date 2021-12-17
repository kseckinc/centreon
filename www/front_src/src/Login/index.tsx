import * as React from 'react';

import { Formik } from 'formik';
import { isNil, not, pipe, propOr } from 'ramda';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai/utils';

import { Paper, makeStyles, Typography } from '@material-ui/core';

import { LoadingSkeleton } from '@centreon/ui';

import logoCentreon from '../Navigation/Sidebar/Logo/centreon.png';
import Copyright from '../Footer/Copyright';
import { areUserParametersLoadedAtom } from '../Main/mainAtom';
import MainLoader from '../Main/MainLoader';

import useValidationSchema from './validationSchema';
import { LoginFormValues } from './models';
import useLogin from './useLogin';
import LoginForm from './Form';
import { labelCentreonLogo } from './translatedLabels';

const useStyles = makeStyles((theme) => ({
  copyrightAndVersion: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing(0.5),
  },
  loginBackground: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'center',
    rowGap: theme.spacing(2),
    width: '100%',
  },
  loginPaper: {
    padding: theme.spacing(2, 3),
    width: 'fit-content',
  },
}));

const initialValues: LoginFormValues = {
  alias: '',
  password: '',
};

const LoginPage = (): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();
  const validationSchema = useValidationSchema();

  const { submitLoginForm, webVersions } = useLogin();
  const areUserParametersLoaded = useAtomValue(areUserParametersLoadedAtom);

  const hasInstalledVersion = pipe(
    propOr(null, 'installedVersion'),
    isNil,
    not,
  );

  if (areUserParametersLoaded || isNil(areUserParametersLoaded)) {
    return <MainLoader />;
  }

  return (
    <div className={classes.loginBackground}>
      <Paper className={classes.loginPaper}>
        <img
          alt={t(labelCentreonLogo)}
          aria-label={t(labelCentreonLogo)}
          src={logoCentreon}
        />
        <Formik<LoginFormValues>
          validateOnBlur
          validateOnMount
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitLoginForm}
        >
          <LoginForm />
        </Formik>
      </Paper>
      <div className={classes.copyrightAndVersion}>
        <Copyright />
        {hasInstalledVersion(webVersions) ? (
          <Typography variant="body2">
            v. {webVersions?.installedVersion}
          </Typography>
        ) : (
          <LoadingSkeleton variant="text" width="40%" />
        )}
      </div>
    </div>
  );
};

export default LoginPage;

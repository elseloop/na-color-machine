import {Box} from '@material-ui/core';
import LoginButton from './login-button';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const UnauthenticatedNav = ({logo}) => {
  return (
    <>
      <img style={{ width: '250px', margin: '5rem auto 0' }} className="brand" src={logo} alt="Next Adventure logo" />

      <Typography variant="overline" component="h1" style={{margin: '1rem auto 0', fontSize: '2.5rem' }}>
        Color code generator
      </Typography>

      <Box className="nav--main" display="flex" justifyContent="center" flexDirection="row">
        <LoginButton />
      </Box>

      <Box className="nav--main" display="flex" justifyContent="center" flexDirection="row">
        <Typography variant="body1" gutterBottom style={{textAlign: 'left', margin: '1rem 0 0', display: 'block'}}>
          A valid Next Adventure email address is required for access.
        </Typography>
      </Box>
    </>
  );
}

export default UnauthenticatedNav;

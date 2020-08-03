import React from 'react';
import {
  Button,
  Container,
  Box,
  TextareaAutosize,
  CircularProgress
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './login-button';
import LogoutButton from './logout-button';

import './App.css';

function App() {
  const [value, setValue] = React.useState('')
  const { isAuthenticated, isLoading } = useAuth0();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const AuthenticatedNav = () => {
    const { user } = useAuth0();

    return (
      <Box className="nav--main nav--loggedin" display="flex" justifyContent="flex-end" flexDirection="row">
        {console.log(JSON.stringify(user, null, 2))}
        <img className="user-avatar" src={user.picture} alt={user.name} />
        <LogoutButton />
      </Box>
    );
  }

  const UnauthenticatedNav = () => {
    return (
      <>
        <Typography variant="h3" gutterBottom style={{margin: '4rem auto'}}>
          Color codes easier-making machine
        </Typography>

        <Box className="nav--main" display="flex" justifyContent="flex-end" flexDirection="row">
          <LoginButton />
      </Box>
      </>
    );
  }

  const AuthenticatedApp = () => {
    return (
      <>
        <AuthenticatedNav />

        <Typography variant="h3" gutterBottom style={{margin: '4rem auto'}}>
          Color codes easier-making machine
        </Typography>

        <form noValidate autoComplete="off">
          <Box style={{height: "100%", width: '100%', borderBottom: '2rem' }} display="flex" justifyContent="space-between" flexDirection="row" color="text.primary">
            <Box color="text.primary" display="flex" justifyContent="flex-start" flexDirection="column" style={{ width: '48%' }}>
              <Typography variant="body1" style={{ marginBottom: '1rem', marginRight: 'auto' }}>
                Paste color strings here, one per line.
              </Typography>

              <TextareaAutosize
                id="unloader"
                rowsMin={13}
                variant="outlined"
                value={value}
                onChange={handleChange}
                style={{ backgroundColor: 'transparent', padding: '1rem' }}
              />

              <Button variant="contained" size="large" style={{ maxWidth: '50%', margin: '2rem auto 0 0' }}>
              <span style={{ fontSize: '1.25rem' }} role="img" aria-label="rocket emoji"> 🔍</span>
              &nbsp;
              Search
              </Button>
            </Box>

            <Box display="flex" justifyContent="center" flexDirection="column" style={{ width: '48%' }}>
              <Typography  display="block">
                <span role="img" aria-label="disappointed face emoji"> 😞</span> &nbsp; no results&hellip;
              </Typography>
            </Box>
          </Box>
        </form>
      </>
    );
  };

  // ✅ authenticated users only
  // fetch data
  // clean input data
  // search for match(es)
  // display result(s)
  // if no result, create new code and display
  // write new code to sheet

  if (isLoading) {
    return (
      <Box style={{height: "100vh", width: "100vw"}} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography component="div" style={{ height: '100vh' }}>
          <Box style={{height: "100%"}} display="flex" justifyContent="flex-start" flexDirection="column" color="text.primary">
            {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedNav />}
          </Box>
        </Typography>
      </Container>
    </div>
  );
}

export default App;

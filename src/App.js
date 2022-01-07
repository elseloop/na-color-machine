import React, { useEffect } from 'react';
import {
  Container,
  Box,
  CircularProgress
} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './components/login-button';
import LogoutButton from './components/logout-button';
import ColorEntryForm from './components/color-entry-form';
import { useAirtableData } from './data/airtable-base';

import './App.css';
import logo from './logo.png';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  const AuthenticatedNav = () => {
    const { user } = useAuth0();

    return (
      <Box style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          margin: '2rem 0 5rem'
        }}>
          <Box style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}>
            <img style={{ width: '125px', margin: '0 2ch 0 0' }} className="brand" src={logo} alt="Next Adventure logo" />
          <Typography variant="overline" component="h1" style={{margin: '0', fontSize: '1.5rem' }}>
            Color code generator
          </Typography>
        </Box>

        <Box style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}>
          <img className="user-avatar" src={user.picture} alt={user.name} />
          <LogoutButton />
        </Box>
      </Box>
    );
  }

  const UnauthenticatedNav = () => {
    return (
      <>
        <img style={{ width: '250px', margin: '5rem auto 0' }} className="brand" src={logo} alt="Next Adventure logo" />

        <Typography variant="overline" component="h1" style={{margin: '1rem auto 0', fontSize: '2.5rem' }}>
          Color code generator
        </Typography>

        <Box className="nav--main" display="flex" justifyContent="center" flexDirection="row">
          <LoginButton />
      </Box>
      </>
    );
  }

  const AuthenticatedApp = () => {
    const { user } = useAuth0();
    const { airtableData, getData } = useAirtableData();

    useEffect(() => {
        async function onPageLoad () {
            await getData();
        }

      onPageLoad();
    }, [getData]);

    return (
      <>
        <AuthenticatedNav />

        {airtableData && <ColorEntryForm data={airtableData} user={user} />}
      </>
    );
  };

  if (isLoading) {
    return (
      <Box style={{ height: "100vh", width: "100vw" }} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography component="div">
          <Box style={{ height: "100%" }} display="flex" justifyContent="flex-start" flexDirection="column" color="text.primary">
            {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedNav />}
          </Box>
        </Typography>
      </Container>
    </div>
  );
}

export default App;

import './App.css';

import {
  Box,
  CircularProgress,
  Container
} from '@material-ui/core';
import React, { useEffect } from 'react';

import AuthenticatedNav from './components/auth-nav';
import ColorEntryForm from './components/color-entry-form';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import UnauthenticatedNav from './components/unauth-nav';
import logo from './logo.png';
import { useAirtableData } from './data/airtable-base';
import { useAuth0 } from '@auth0/auth0-react';

// composes authenticated & unauthenticated versions of the App
// based on whether the user is logged in or not
function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  const AuthenticatedApp = () => {
    const { user } = useAuth0();
    const { airtableData, getData } = useAirtableData();

    // fetch data from Airtable when the auth component mounts
    useEffect(() => {
      async function onPageLoad () {
        await getData();
      }

      onPageLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <AuthenticatedNav user={user} logo={logo} />

        {airtableData
        ?
          <ColorEntryForm data={airtableData} user={user} />
        :
          <Box style={{ height: "300px", width: "100%" }} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <CircularProgress />
          </Box>
        }
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
            {
              isAuthenticated
              ? <AuthenticatedApp />
              : <UnauthenticatedNav logo={logo} />
            }
          </Box>
        </Typography>
      </Container>
    </div>
  );
}

export default App;

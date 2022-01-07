import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Auth0Provider from './auth0-provider-with-history';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

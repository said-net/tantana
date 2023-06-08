import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from "@material-tailwind/react";
import Main from './main';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Manager from './manager/manager';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Provider store={Manager}>
          <Main />
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
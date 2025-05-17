import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';


const AppWithTheme = () => {
  const mode = useSelector((state) => state.theme?.mode); 

  const muiTheme = createTheme({
    palette: {
      mode: mode || 'light', 
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <App />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWithTheme />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

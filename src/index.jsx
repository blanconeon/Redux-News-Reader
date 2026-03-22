import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import "./App.css";

import { worker } from './mocks/browser';

const root = createRoot(document.getElementById('root'));
worker.start();

root.render(
<React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

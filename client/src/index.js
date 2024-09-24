import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SocketContextProvider } from './context/SocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <SocketContextProvider>
          <div className='bg-black'>
          <App/>
          </div>
        </SocketContextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
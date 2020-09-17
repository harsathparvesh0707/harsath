import React from 'react';
import ReactDOM from 'react-dom';
import Route from './fetchAPI/routing';
import './css/index.css';
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./View/reducer.js"
const store = createStore(rootReducer)
ReactDOM.render(
  <React.StrictMode>
     <Provider store={store}>
    <Route />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
); 
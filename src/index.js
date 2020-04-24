import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Switch, Router, route, hashHistory, Link, Route} from 'react-router-dom'
import {AppAbout, AppIndex, AppMessage} from "./App"
import 'semantic-ui-css/semantic.min.css'

ReactDOM.render(
  <BrowserRouter basename="/" >
    
    <App></App>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

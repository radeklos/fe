import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App.jsx';

import { Router, Route, hashHistory } from 'react-router'

import About from './app/modules/About'
import Repos from './app/modules/Repos'


ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
        <Route path="/repos" component={Repos}/>
        <Route path="/about" component={About}/>
        </Route>
    </Router>),
    document.getElementById('app')
);

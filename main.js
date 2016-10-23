import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App.jsx';

import { Router, Route, hashHistory } from 'react-router'

import About from './app/modules/About.jsx'
import Join from './app/modules/Join.jsx'


ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/about" component={About}/>
            <Route path="/join" component={Join}/>
        </Route>
    </Router>),
    document.getElementById('app')
);

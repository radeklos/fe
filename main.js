import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App.jsx';

import {
    Router,
    Route,
    IndexRoute,
    browserHistory,
    ReactRouter
} from 'react-router'

import About from './app/modules/About.jsx'
import {
    Join,
    Finished
} from './app/modules/Join.jsx'


ReactDOM.render((
        <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="/about" component={About}/>
            <Route path="/join">
                <IndexRoute component={Join} />
                <Route path="finished" component={Finished}/>
            </Route>
        </Route>
    </Router>),
    document.getElementById('app')
);

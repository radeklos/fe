import React from "react";

import ReactDOM from "react-dom";
import {browserHistory, IndexRoute, Route, Router} from "react-router";

import App from "./App";

import About from "./modules/About";
import {Finished, Join} from "./modules/Join.jsx";
import {U} from "./modules/U.jsx";

import "./index.css";


ReactDOM.render((
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={U}/>
                <Route path="/about" component={About}/>
                <Route path="/join">
                    <IndexRoute component={Join}/>
                    <Route path="finished" component={Finished}/>
                </Route>
            </Route>
        </Router>),
    document.getElementById('root')
);

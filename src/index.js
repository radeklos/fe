import React from 'react';
import registerServiceWorker from './registerServiceWorker';
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";


ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();

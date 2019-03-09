import React from 'react';
import ReactDOM from "react-dom";
import "@babel/polyfill";
import { CookiesProvider } from 'react-cookie';
import App from "./components/App"

require('dotenv').config();

ReactDOM.render(<CookiesProvider> <App /> </CookiesProvider>, document.querySelector('#root'));
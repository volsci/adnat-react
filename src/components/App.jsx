import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SignUp from './SignUp'
import LogIn from "./LogIn";
import ForgotPassword from "./ForgotPassword";


export default function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={LogInPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/forgotpass" component={ForgotPasswordPage} />
      </div>
    </Router>
  );
}

function LogInPage() {
  return <LogIn/>;
}

function SignUpPage() {
  return <SignUp/>;
}

function ForgotPasswordPage() {
  return <ForgotPassword/>;
}
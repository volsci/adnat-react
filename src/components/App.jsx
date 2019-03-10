import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SignUp from './SignUp';
import LogIn from './LogIn';
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';

function LogInPage() {
  return <LogIn />;
}

function SignUpPage() {
  return <SignUp />;
}

function ForgotPasswordPage() {
  return <ForgotPassword />;
}

function DashboardPage() {
  return <Dashboard />;
}

export default function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={LogInPage} />
        <Route path="/signup" component={SignUpPage} />
        <Route path="/forgotpass" component={ForgotPasswordPage} />
        <Route path="/dashboard" component={DashboardPage} />

      </div>
    </Router>
  );
}

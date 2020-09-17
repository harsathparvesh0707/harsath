
import React from "react";
import { BrowserRouter as Router, Switch,  Route, Link } from "react-router-dom";
import Home from '../View/Home';
import Login from '../View/Login';
import AdminDash from '../View/Admin/Admindash'
import SignUP from '../View/Signup'
export default function BasicExample() {
  return (
    <Router>
      <div> 
        <Switch>
          <Route exact path="/">
            <SignUP />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/AdminDash">
            <AdminDash />
          </Route>
          <Route path="/SignUP">
            <SignUP />
          </Route>
        </Switch>
      </div>
    </Router>
  );
} 
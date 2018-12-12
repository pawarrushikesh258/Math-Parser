import React, { Component } from 'react';
import { render } from 'react-dom';
import logo from './logo.svg';
import App from './components/App';
import ls from 'local-storage';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import ResultHistory from './components/ResultHistory';
import './components/App.css';
var ReactRouter = require('react-router-dom');
var IndexRoute = ReactRouter.IndexRoute;
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;



const  router = (
<Router>
  <div className="container">
    <Route path='/' component={App}/>
    <Route path='/Login' component={Login}/>
    <Route path='/Home' component={Home}/>
    <Route path='/Profile' component={Profile}/>
      <Route path='/Result' component={ResultHistory}/>
    </div>
  </Router>
)
render(router, document.getElementById('root'));

import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import NavBar from '../components/NavBar';

import Login from '../views/Login/Login';
import Augment from '../views/Augment/augment'
import Predict from '../views/Predict/predict';

var hist = createBrowserHistory();

var routes = [
  { path: '/', component: Augment },
  { path: '/augment', component: Augment },
  { path: '/validate', component: Predict },
  { path: '/auth', component: Login },
];

export default class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <div style={{marginTop:'10px'}}>
          <Router history={hist}>
            <Switch>
              {routes.map((prop, key) => {
                return (
                  <Route
                    exact
                    path={prop.path}
                    key={key}
                    component={prop.component}
                  />
                );
              })}
            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

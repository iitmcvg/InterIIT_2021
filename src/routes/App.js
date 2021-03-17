import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import NavBar from '../components/NavBar';
import Results from '../components/Results';
import CardGrid from '../components/CardGrid';

import Login from '../views/Login/Login';
import Augment from '../views/Augment/aug'

var hist = createBrowserHistory();

var routes = [
  { path: '/', component: Augment },
  { path: '/augment', component: Augment},
  { path: '/results', component: Results },
  { path: '/auth', component: Login },
];

export default class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
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
        <CardGrid />
      </div>
    );
  }
}

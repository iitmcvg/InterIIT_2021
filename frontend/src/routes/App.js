import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import NavBar from '../components/NavBar';

import Augment from '../views/Augment/augment';
import Training from '../views/Training/training';
import Predict from '../views/Predict/predict';
import Results from '../views/Results/results';
import Visuals from '../views/Visualization/visual';

var hist = createBrowserHistory();

var routes = [
  { path: '/', component: Augment },
  { path: '/augment', component: Augment },
  { path: '/train', component: Training },
  { path: '/inference', component: Predict },
  { path: '/results', component: Results },
  { path: '/visualization', component: Visuals },
];

export default class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <div style={{ marginTop: '10px' }}>
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

import React from 'react';
import { Switch, Route } from 'react-router';

import FruitPage from './containers/FruitPage';
//LoginPage import LoginPage from './containers/LoginPage';
//ORIG import LoggedInPage from './containers/LoggedInPage';

export default (
  <Switch>
    <Route path="/" component={FruitPage} />
  </Switch>
);

/* LoginPage
export default (
  <Switch>
    <Route path="/" component={LoginPage} />
  </Switch>
);
*/

/* ORIG
export default (
  <Switch>
    <Route exact path="/" component={LoginPage} />
    <Route exact path="/loggedin" component={LoggedInPage} />
  </Switch>
);
*/

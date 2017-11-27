import React, { Component } from 'react';
import PropTypes from 'prop-types';

//import {Link} from 'react-router';
import { Link } from 'react-router-dom';

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired
  };

  _inputRef: null;

  handleLogin = () => {
    this.props.onLogin({
      username: this._inputRef.value,
      loggedIn: true
    });
  }

  render() {
    console.log('Login: Render');
    const d = {
      index : 0,
      name : 'Ble Name X',
      address : '112233445566'
    };
    return (
      <div>
        <h2>Login</h2>
        <input ref={(ref) => { this._inputRef = ref; }} type="text" />
        <button onClick={this.handleLogin}>Log In</button>
        <Link to="/loggedin"  className='btn btn-primary'>Stop</Link>
        <ul>
          <li><Link to="/root1"  className='btn btn-primary'>To /root1</Link></li>
          <li><Link to="/root2"  className='btn btn-primary'>To /root2</Link></li>
          <li><Link to="/scan"  className='btn btn-primary'>To /scan</Link></li>
          <li><Link to={'connect/'+d.index} className='list-group-item' key={d.index}>{d.name} [{d.address}]</Link></li>

        </ul>
        <SubRoutes />
      </div>
    );
  }
}

//import React from 'react';
import { Switch, Route } from 'react-router';

import LoggedInPage from '../containers/LoggedInPage';
import Root1Page from '../containers/Root1Page';
import Root2Page from '../containers/Root2Page';
import ScanPage from '../containers/ScanPage';
import ConnectPage from '../containers/ConnectPage';

class SubRoutes extends Component {
  render() {
    console.log('SubRoutes: Render');
    return (
      <div>
        <Switch>
          <Route exact path="/root1" component={Root1Page} />
          <Route exact path="/root2" component={Root2Page} />
          <Route exact path="/scan" component={ScanPage} />
          <Route       path="/connect/:index" component={ConnectPage} />
          <Route exact path="/loggedin" component={LoggedInPage} />
        </Switch>
      </div>
    );
  }
}

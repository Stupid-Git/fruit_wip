import React, { Component } from 'react';

//import { Switch, Route } from 'react-router';
//NGimport {Link} from 'react-router';
import { Link } from 'react-router-dom';

export default class Root2 extends Component {
  render() {
    console.log('Root2: Render');
    return (
      <div>
        <h2>----- Root2 -----</h2>
        <Link to="/"  className='btn btn-primary'>To /</Link>
        <Link to="/loggedin"  className='btn btn-primary'>To Here</Link>
      </div>
    );
  }
}

/*
<h2>Logged in as {this.props.user.username}</h2>
<h3>Logged in as {this.props.user.username}</h3>
<Link to="/"  className='btn btn-primary'>To /</Link>
<Link to="/loggedin"  className='btn btn-primary'>To Here</Link>
<div>
</div>
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

//NGimport {Link} from 'react-router';
import { Link } from 'react-router-dom';

export default class Fruit extends Component {
  static propTypes = {
    onFruit: PropTypes.func.isRequired
  };

  _inputRef: null;

  handleFruit = () => {
    this.props.onFruit({
      username: this._inputRef.value,
      loggedIn: true
    });
  }


  render() {
    console.log('Fruit: Render ', this.props);

    return (
      <div>
        <nav className='navbar navbar-inverse navbar-fixed-top'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar-elements' aria-expanded='false'>
                <span className='sr-only'>Toggle navigation</span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
              </button>
              <span className='navbar-brand' >
                  <span><img src='assets/adafruit_logo_small.png' height='25' width='25'/></span>
                  &nbsp; Bluefruit LE
              </span>
            </div>
            <div className='collapse navbar-collapse' id='navbar-elements'>
              <ul className='nav navbar-nav navbar-right'>
                <li><a data-toggle='modal' data-target='#about-modal' style={{cursor:'pointer'}}>About</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='container-fluid'>
          <SubRoutes />
        </div>
      </div>
    );
  }
}
/*
<ul className='nav navbar-nav navbar-left'>
  <li><Link to="/root1"  className='btn btn-primary'>To /root1</Link></li>
  <li><Link to="/root2"  className='btn btn-primary'>To /root2</Link></li>
  <li><Link to="/scan"  className='btn btn-primary'>To /scan</Link></li>
</ul>

*/
//import React from 'react';
import { Switch, Route } from 'react-router';

//import LoggedInPage from '../containers/LoggedInPage';
import Root1Page from '../containers/Root1Page';
import Root2Page from '../containers/Root2Page';
import ScanPage from '../containers/ScanPage';
import ConnectPage from '../containers/ConnectPage';
import InformationPage from '../containers/InformationPage';
import UARTPage from '../containers/UARTPage';
//import ControlPage from '../containers/ControlPage';
//import ColorPage from '../containers/ColorPage';

class SubRoutes extends Component {
  render() {
    console.log('SubRoutes: Render ', this.props);
    return (
      <div>
        <Switch>

          <Route exact path="/root1" component={Root1Page} />
          <Route exact path="/root2" component={Root2Page} />

          <Route exact path="/scan"           component={ScanPage} />
          <Route       path="/connect/:index" component={ConnectPage} />
          <Route       path='/info/:index'    component={InformationPage}/>
          <Route       path='/uart/:index'    component={UARTPage}/>
          {/*
          <Route       path='/control/:index' component={ControlPage}/>
          <Route       path='/color/:index'   component={ColorPage}/>

          <Route       path="/loading"        component={Loading}/>
          <Route       path='/info/:index'    component={Information}/>
          <Route       path='/uart/:index'    component={UART}/>
          <Route       path='/control/:index' component={Control}/>
          <Route       path='/color/:index'   component={Color}/>
          <Route       path='/bno055/:index'  component={BNO055}/>
          */}
        </Switch>
      </div>
    );
  }
}

/*
// Define table of routes.
let routes = (
  <Route name='app' path='/' handler={App}>
    <Route name='loading' path='loading'        handler={Loading}/>
    <Route name='scan'    path='scan'           handler={Scan}/>
    <Route name='connect' path='connect/:index' handler={Connect}/>
    <Route name='info'    path='info/:index'    handler={Information}/>
    <Route name='uart'    path='uart/:index'    handler={UART}/>
    <Route name='control' path='control/:index' handler={Control}/>
    <Route name='color'   path='color/:index'   handler={Color}/>
    <Route name='bno055'  path='bno055/:index'  handler={BNO055}/>
  </Route>
);

*/

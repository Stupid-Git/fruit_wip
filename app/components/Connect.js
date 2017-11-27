import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const {ipcRenderer} = require('electron');

import SingleColumnView from './singlecolumnview.js';
import StatusBar from './statusbar.js';


export default class Connect extends Component {
  constructor() {
    super();
    // Set internal state.
    this.state = {device: null};
    // Manually bind functions so they have proper context.
    this.connectStatus = this.connectStatus.bind(this);
  }

  componentDidMount() {

    // Grab the device for this connection and set state appropriately.
    let d = ipcRenderer.sendSync('getDevice', this.props.match.params.index);
    //OLD let d = ipcRenderer.sendSync('getDevice', this.props.params.index);
    this.setState({device: d});
    // Setup async events that will change state of this component.
    ipcRenderer.on('connectStatus', this.connectStatus);
    // Tell main process to connect to device.
    ipcRenderer.send('deviceConnect', this.props.match.params.index);
    //OLD ipcRenderer.send('deviceConnect', this.props.params.index);
  }

  connectStatus(sender, status, progress) {
    console.log('connectStatus: progress = ', progress);
    // Update the status of the connection attempt.
    // https://stackoverflow.com/questions/38950051/get-element-reference-without-using-refs-in-react
    this.refs.statusbar.setStatus(status);
    this.refs.statusbar.setProgress(progress);
    // Once the progress is 100% then move to the device info page.
    if (progress === 100) {
      console.log('connectStatus: progress = 100%');
      //OLD router.transitionTo('info', {index: this.props.params.index});
      //TODO      router.transitionTo('info', {index: this.props.match.params.index});
    }
  }

  componentWillUnmount() {
    /*TODO*/
    // Be careful to make sure state changes aren't triggered by turning off listeners.
    ipcRenderer.removeListener('connectStatus', this.connectStatus);
    /*TODO */
  }

  render(){
    console.log('Connect: this.props = ', this.props );
    console.log('Connect: this.props.match = ', this.props.match );
    console.log('Connect: this.props.match.params.index = ', this.props.match.params.index );

    console.log('Connect: this.state = ', this.state );
    console.log('Connect: this.state.device = ', this.state.device );
    return (
      <SingleColumnView header='Connecting'>
        <StatusBar ref='statusbar' prefix='Status:'/>
        <ul className='list-inline text-right'>
          <li><Link to='/scan' className='btn btn-primary'>Stop</Link></li>
        </ul>
      </SingleColumnView>
    );
  }
}

/*

export default class Connect extends Component {
  render() {
    console.log('Connect: Render');
    return (
      <div>
        <h2>----- Connect -----</h2>
        <Link to="/"  className='btn btn-primary'>To /</Link>
        <Link to="/loggedin"  className='btn btn-primary'>To Here</Link>
      </div>
    );
  }
}
return (
  <SingleColumnView header='Connecting'>
    {this.state.device === null ? '' : <h4>{this.state.device.name} [{this.state.device.address}]</h4>}
    <StatusBar ref='statusbar' prefix='Status:'/>
    <ul className='list-inline text-right'>
      <li><Link to='scan' className='btn btn-primary'>Stop</Link></li>
    </ul>
  </SingleColumnView>
);

*/

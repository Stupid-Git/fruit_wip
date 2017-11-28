// Main device view with links to various device interactions.
import React from 'react';
//NGimport {Link} from 'react-router';
import { Link } from 'react-router-dom';

const {ipcRenderer} = require('electron');


export default class DeviceView extends React.Component {
  constructor() {
    super();
    // Set internal state.
    this.state = {name: null, status: null};
    this.connectStatus = this.connectStatus.bind(this);
  }

  connectStatus(status) {
    this.setState({status: status});
  }

  componentDidMount() {
    // Grab the device & connection state for this connection and set state appropriately.
    let device = ipcRenderer.sendSync('getDevice', this.props.index);
    let connectStatus = ipcRenderer.sendSync('getConnectStatus');
    this.setState({name: device.name, status: connectStatus});
    // Subscribe to connection status changes.
    ipcRenderer.on('connectStatus', this.connectStatus);
  }

  componentWillUnmount() {
    // Be careful to make sure state changes aren't triggered by turning off listeners.
    ipcRenderer.removeListener('connectStatus', this.connectStatus);
  }

  render() {
    console.log('DeviceView: Render this.props', this.props);
    console.log('DeviceView: Render this.state', this.state);

    let idx = this.props.index;
    //e.g this.props.history.push('/info/' + i);

    return (
      <div className='row'>
        <div className='col-sm-2'>
          <div className='list-group'>
            <div className='list-group-item'>
              <h6 className='list-group-item-heading'>{this.state.name}</h6>
            </div>
            <div className={this.state.status !== 'Connected' && this.state.status !== null ? 'list-group-item list-group-item-warning' : 'list-group-item'}>
              <h7 className='list-group-item-heading'>{this.state.status}</h7>
            </div>
            <Link to='/scan' className='list-group-item'>Disconnect</Link>
          </div>
          <ul className='nav nav-pills nav-stacked'>
            <li role='presentation' className={this.props.header === 'Information' ? 'active' : ''}>
              <Link to={'/info/'+idx}>Information</Link>
            </li>
            <li role='presentation' className={this.props.header === 'UART' ? 'active' : ''}>
              <Link to={'/uart/'+idx}>UART</Link>
            </li>
            <li role='presentation' className={this.props.header === 'Control' ? 'active' : ''}>
              <Link to={'/control/'+idx}>Control</Link>
            </li>
            <li role='presentation' className={this.props.header === 'Color' ? 'active' : ''}>
              <Link to={'/color/'+idx}>Color</Link>
            </li>
            <li role='presentation' className={this.props.header === 'BNO-055' ? 'active' : ''}>
              <Link to={'/bno055/'+idx}>BNO-055</Link>
            </li>
          </ul>
        </div>
        <div className='col-sm-10'>
          <div className='page-header'>
            <h3>{this.props.header}</h3>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

/*
<li role='presentation' className={this.props.header === 'Control' ? 'active' : ''}>
  <Link to='/control' params={{index: this.props.index}}>Control</Link>
</li>
<li role='presentation' className={this.props.header === 'Color' ? 'active' : ''}>
  <Link to='/color' params={{index: this.props.index}}>Color</Link>
</li>
<li role='presentation' className={this.props.header === 'BNO-055' ? 'active' : ''}>
  <Link to='/bno055' params={{index: this.props.index}}>BNO-055</Link>
</li>

*/

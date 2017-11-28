// View for the device UART state.
import React from 'react';
const {ipcRenderer} = require('electron');

import DeviceView from './Deviceview.js';


export default class UART extends React.Component {
  constructor() {
    super();
    // Set internal state.
    this.state = {device: null, services: [], rxData : "WTF"};
    // Manually bind functions so they have proper context.
    this.send = this.send.bind(this);
    this.uartRx = this.uartRx.bind(this);
  }

  //var T = null;

  appendRx(line) {

    var T = this.state.rxData + '\r\n'+ line;
    this.setState({rxData : T});
    // Add a new line to the rx text area.
    //$('#rx').val($('#rx').val() + '\r\n' + line);
  }

  send() {
    //let data = $('#tx').val();
    let data = this.refs.kstx.value;
    this.appendRx('Sent: ' + data);
    ipcRenderer.send('uartTx', data);
  }

  uartRx(sender, data) {
    this.appendRx('Received: ' + data);
  }

  componentDidMount() {
    //this.setState( {rxData : "Data set by setState"} );
    // Setup async events that will change state of this component.
    ipcRenderer.on('uartRx', this.uartRx);
  }

  componentWillUnmount() {
    // Be careful to make sure state changes aren't triggered by turning off listeners.
    ipcRenderer.removeListener('uartRx', this.uartRx);
  }

  render(){
    console.log('UART: Render this.props', this.props);
    console.log('UART: Render this.state', this.state);
    // Render main UART view.
    return (
      <DeviceView header='UART' index={this.props.match.params.index}>
        <p>Send and receive data with a BLE UART device.  Use the bleuart_cmdmode or bleuart_datamode examples
        in the Bluefruit LE Arduino library to send & receive from the device.</p>
        <form>
          <div className='form-group'>
            <label htmlFor='rx'>Received:</label>
            <textarea id='rx' className="form-control" rows="16" readOnly style={{'backgroundColor': '#ffffff'}}
              value={this.state.rxData}
            ></textarea>
          </div>
          <div className='form-group'>
            <label htmlFor='tx'>Send:</label>
            <input ref='kstx' id='tx' className='form-control'/>
          </div>
          <button type='button' className='btn btn-default' onClick={this.send}>Send</button>
        </form>
      </DeviceView>
    );
  }
}

/*
<textarea id='rx' className="form-control" rows="16" readOnly style={{'backgroundColor': '#ffffff'}}></textarea>

*/

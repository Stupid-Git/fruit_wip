import path from 'path';
import url from 'url';
import os from 'os';
import dialog from 'dialog';

import {app, crashReporter, BrowserWindow, Menu} from 'electron';
const {ipcMain} = require('electron');

const noble = require('noble');

const isDevelopment = (process.env.NODE_ENV === 'development');

let mainWindow = null;
let forceQuit = false;

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

crashReporter.start({
  productName: 'YourName',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
  uploadToServer: false
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  // Check running as root on Linux (usually required for noble).
  if (os.platform() === 'linux' && !runningAsRoot()) {
    // Throw an error dialog when not running as root.
    //OLD dialog.showErrorBox('Adafruit Bluefruit LE', 'WARNING: This program should be run as a root user with sudo!');
    dialog.info('WARNING: This program should be run as a root user with sudo!', 'Adafruit Bluefruit LE', function(exitCode) {
      if (exitCode == 0) console.log('User clicked OK');
    });
  }


  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 640,
    minHeight: 480,
    show: false
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));


  // show window once on first load
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      mainWindow.on('close', function (e) {
        if (!forceQuit) {
          e.preventDefault();
          mainWindow.hide();
        }
      });

      app.on('activate', () => {
        mainWindow.show();
      });

      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    }
  });

  if (isDevelopment) {
    // auto-open dev tools
    mainWindow.webContents.openDevTools();

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(props.x, props.y);
        }
      }]).popup(mainWindow);
    });
  }

  moreInitStuffAfter();

});






//=============================================================================
//=============================================================================
//=============================================================================
//=============================================================================
//=============================================================================

// Global state:
let devices = [];             // List of known devices.
let selectedIndex = null;     // Currently selected/connected device index.
let selectedDevice = null;    // Currently selected device.
let selectedAddress = null;   // MAC address or unique ID of the currently selected device.
                              // Used when reconnecting to find the device again.
let uartRx = null;            // Connected device UART RX char.
let uartTx = null;            // Connected device UART TX char.
//let mainWindow = null;        // Main rendering window.
let connectStatus = null;

function moreInitStuffAfter() {

  function onscanStartcallback()
  {
    console.log('########## onscanStartcallback');        //socket.emit(SCANSTARTED_REM, 'Enter Data..');
  }
  function onscanStopcallback()
  {
    console.log('########## onscanStopcallback');
    //socket.emit(SCANSTOPPED_REM, 'Enter Data..');
  }

  noble.on('scanStart', onscanStartcallback);
  noble.on('scanStop', onscanStopcallback);
  //noble.on('discover', ondiscovercallback);

/*
  socket.on(SCANSTART_REM, function(data)
  {
    noble.startScanning();
  });

  socket.on(SCANSTOP_REM, function(data)
  {
    noble.stopScanning();
  });
*/

  noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
      console.log('NOBLE POWERED ON');
    } else {
      console.log('NOBLE NOT POWERED ON');
    }
  });

  // ipcMain.on sets up an event handler so the renderer process (the webpage's
  // javascript) can 'call' functions in this main process.  These events are
  // defined below:
  ipcMain.on('startScan', function() {
    //===== Karel Debug =====
    //console.log('ipcMain.on(startScan');

    devices = [];
    var device = null;
    device = { id : "BLEDEV_ID0",
                    advertisement : {
                     localName : "BLE_LocalName0"
                   },
                   address : "000000000000",
                 };
/*
    id: device.id,
    name: device.advertisement.localName,
    address: device.address,
    index: index
*/
    let index = 0;
    index = devices.push(device)-1;
    console.log("index = " + index);
    console.log("devices[0].id = " + devices[0].id);

    device = { id : "BLEDEV_ID1",
                    advertisement : {
                     localName : "BLE_LocalName1"
                   },
                   address : "111111111111",
                 };
   index = devices.push(device)-1;
   console.log("index = " + index);
   console.log("devices[0].id = " + devices[1].id);
/*
    var xxx = devices.map(serializeDevice);
    console.log("xxx.name    = " + xxx[0].name);
    console.log("xxx.index   = " + xxx[0].index);
    console.log("xxx.id      = " + xxx[0].id);
    console.log("xxx.address = " + xxx[0].address);
    var yyy = JSON.stringify(xxx);
    console.log("yyy = " + yyy);
    mainWindow.webContents.send('devicesChanged', yyy);
    */
    mainWindow.webContents.send('devicesChanged', devices.map(serializeDevice));
    //return;

    //===== Karel Debug =====

    // Start scanning for new BLE devices.
    // First clear out any known and selected devices.
    devices = [];
    disconnect();
    // Start scanning only if already powered up.
    if (noble.state === 'poweredOn') {
      console.log('Starting scan... ');
      noble.startScanning();
    }
  });

  ipcMain.on('stopScan', function() {
    console.log('ipcMain.on(stopScan, ...');
    // Stop scanning for devices.
    //console.log('Stopping scan...');
    noble.stopScanning();
  });

  ipcMain.on('getDevice', function(event, index) {
    // Retrieve the selected device by index.
    console.log('ipcMain.on( getDevice: index = ', index);
    //console.log('RETURNING')
    //event.returnValue = null;
    //return;

    let device = devices[index];
    event.returnValue = serializeDevice(device, index);
  });

  ipcMain.on('getServices', function(event, index) {
    // Retrieve list of all services and characteristics for a device with
    // the specified index.
    console.log('ipcMain.on( getServices: index = ', index);
    event.returnValue = serializeServices(index);
  });

  ipcMain.on('getConnectStatus', function(event) {
    // Return the current device connection status.
    event.returnValue = connectStatus;
  });

  ipcMain.on('deviceConnect', function(event, index) {
    console.log('ipcMain.on( deviceConnect: index = ', index);
    //console.log('RETURNING')
    //return;
    // Start connecting to device at the specified index.
    // First get the selected device and save it for future reference.
    selectedIndex = index;
    selectedDevice = devices[index];
    selectedAddress = selectedDevice.address;
    // Stop scanning and kick off connection to the device.
    noble.stopScanning();
    setConnectStatus('Connecting...', 33);
    selectedDevice.connect(connected);
  });

  ipcMain.on('uartTx', function(event, data) {
    // Data is sent from the renderer process out the BLE UART (if connected).
    if (uartTx !== null) {
      console.log('Send: ' + data);
      uartTx.write(new Buffer(data));
    }
  });

  ipcMain.on('readChar', function(event, serviceId, charId) {
    // Request a characteristic value to be read.
    if (selectedIndex !== null) {
      // Grab the selected device, find the characteristic (based on its parent
      // service index), and call its read function to kick off the read.
      let device = devices[selectedIndex];
      device.services[serviceId].characteristics[charId].read(function(error, data) {
        // Char value was read, now check if it failed for some reason and then
        // send the value to the renderer process to update its state and render.
        if (error) {
          console.log('Error reading characteristic: ' + error);
        }
        else {
          mainWindow.webContents.send('charUpdated', serviceId, charId, String(data));
        }
      });
    }
  });

  noble.on('discover', function(device) {
    console.log('########## discover');
    // Noble found a device.  Add it to the list of known devices and then send
    // an event to notify the renderer process of the current device state.
    let index = devices.push(device)-1;
/*
    var xxx = devices.map(serializeDevice);
    console.log("xxx.name    = " + xxx[0].name);
    console.log("xxx.index   = " + xxx[0].index);
    console.log("xxx.id      = " + xxx[0].id);
    console.log("xxx.address = " + xxx[0].address);
    var yyy = JSON.stringify(xxx);
    console.log("yyy = " + yyy);
    mainWindow.webContents.send('devicesChanged', yyy);
*/
    mainWindow.webContents.send('devicesChanged', devices.map(serializeDevice));

    // Check if the found device is one we're attempting to reconnect to and kick
    // off the reconnection.
    if (selectedAddress !== null && device.address === selectedAddress) {
      console.log('Found device, reconnecting...');
      selectedIndex = index;
      selectedDevice = devices[index];
      noble.stopScanning();
      selectedDevice.connect(connected);
    }
  });

/* TODO
  // Start in the scanning mode if powered on, otherwise start in loading
  // mode and wait to power on before scanning.
  if (noble.state === 'poweredOn') {
    mainWindow.loadUrl('file://' + __dirname + '/../app.html#scan');
  }
  else {
    mainWindow.loadUrl('file://' + __dirname + '/../app.html#loading');
    // Jump to scanning mode when powered on.  Make sure to do this only after
    // showing the loading page or else there could be a race condition where
    // the scan finishes and the loading page is displayed.
    noble.on('stateChange', function(state) {
      if (state === 'poweredOn') {
        mainWindow.loadUrl('file://' + __dirname + '/../app.html#scan');
      }
    });
  }

  // Open dev tools if --dev parameter is passed in.
  if (process.argv.indexOf('--dev') !== -1) {
    mainWindow.openDevTools();
  }
TODO */
  mainWindow.on('closed', function() {
    // Emitted when the window is closed.
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

}

//=============================================================================
//=============================================================================
//=============================================================================
//=============================================================================
//=============================================================================

function runningAsRoot() {
  // Check if the user is running as root on a POSIX platform (Linux/OSX).
  // Returns true if it can be determined the user is running as root, otherwise
  // false.
  if (os.platform() === 'linux' || os.platform() === 'darwin') {
    return process.getuid() === 0;
  }
  else {
    return false;
  }
}

function serializeDevice(device, index) {
  // Prepare a Noble device for serialization to send to a renderer process.
  // Copies out all the attributes the renderer might need.  Seems to be
  // necessary as Noble's objects don't serialize well and lose attributes when
  // pass around with the ipcMain class.
  return {
    id: device.id,
    name: device.advertisement.localName,
    address: device.address,
    index: index
  };
}

function serializeServices(index) {
  // Prepare all the services & characteristics for a device to be serialized
  // and sent to the rendering process.  This will be an array of service objects
  // where each one looks like:
  //  { uuid: <service uuid, either short or long>,
  //    name: <friendly service name, if known>,
  //    type: <service type, if known>
  //    characteristics: [<list of characteristics (see below)>] }
  //
  // For each service its characteristics attribute will be a list of
  // characteristic objects that look like:
  //  { uuid: <char uuid>,
  //    name: <char name, if known>
  //    type: <char type, if known>
  //    properties: [<list of properties for the char>],
  //    value: <last known characteristic value, or undefined if not known>
  //  }
  let device = devices[index];
  let services = device.services.map(function(s) {
    return {
      uuid: s.uuid,
      name: s.name,
      type: s.type,
      characteristics: s.characteristics.map(function(c) {
        return {
          uuid: c.uuid,
          name: c.name,
          type: c.type,
          properties: c.properties
        };
      })
    };
  });
  return services;
}

function findUARTCharacteristics(services) {
  // Find the UART RX and TX characteristics and save them in global state.
  // Process all the characteristics.
  services.forEach(function(s, serviceId) {
    s.characteristics.forEach(function(ch, charId) {
      // Search for the UART TX and RX characteristics and save them.
      if (ch.uuid === '6e400002b5a3f393e0a9e50e24dcca9e') {
        uartTx = ch;
      }
      else if (ch.uuid === '6e400003b5a3f393e0a9e50e24dcca9e') {
        uartRx = ch;
        // Setup the RX characteristic to receive data updates and update
        // the UI.  Make sure no other receivers have been set to prevent them
        // stacking up on reconnect.
        uartRx.removeAllListeners('data');
        uartRx.on('data', function(data) {
          if (mainWindow !== null) {
            mainWindow.webContents.send('uartRx', String(data));
          }
        });
        uartRx.notify(true);
      }
    });
  });
}

function setConnectStatus(status, percent) {
  console.log('##### setConnectStatus percent = ' + percent);
  //if(percent === undefined)
  //  return;
  // Set the current device connection status as shown in the UI.
  // Will broadcast out the change on the connectStatus IPC event.
  connectStatus = status;
  mainWindow.webContents.send('connectStatus', status, percent !== undefined ? percent : 0);
}

function connected(error) {
  console.log('##### connected error = ' + error);
  // Callback for device connection.  Will kick off service discovery and
  // grab the UART service TX & RX characteristics.
  // Handle if there was an error connecting, just update the state and log
  // the full error.
  if (error) {
    console.log('Error connecting: ' + error);
    setConnectStatus('Error!');
    return;
  }
  // When disconnected try to reconnect (unless the user explicitly clicked disconnect).
  // First make sure there are no other disconnect listeners (to prevent building up duplicates).
  selectedDevice.removeAllListeners('disconnect');
  selectedDevice.on('disconnect', function() {
    reconnect(selectedAddress);
  });
  // Connected, now kick off service discovery.
  setConnectStatus('Discovering Services...', 66);
  selectedDevice.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
    // Handle if there was an error.
    if (error) {
      console.log('Error discovering: ' + error);
      setConnectStatus('Error!');
      return;
    }
    // Setup the UART characteristics.
    findUARTCharacteristics(services);
    // Service discovery complete, connection is ready to use!
    // Note that setting progress to 100 will cause the page to change to
    // the information page.
    setConnectStatus('Connected', 100);
  });
}

function disconnect() {
  // Null out selected device and index so there is no reconnect attempt made
  // if this was an explicit user choice to disconnect.
  let device = selectedDevice;
  selectedDevice = null;
  selectedIndex = null;
  selectedAddress = null;
  // Now disconnect the device.
  if (device != null) {
    device.disconnect();
  }
}

function reconnect(address) {
  // Don't reconnect if no address is provided.  This handles the case
  // when the user clicks disconnect and really means they don't want to
  // be connected anymore.
  if (address === null) {
    return;
  }
  // Othewise kick off the reconnection to the device.
  console.log('Reconnecting to address: ' + address);
  setConnectStatus('Reconnecting...');
  // Turn on scanning and look for the device again.
  disconnect();
  selectedAddress = address;  // Must happen after disconnect since
                              // disconnect sets selectedAddress null.
  devices = [];
  noble.startScanning();
}

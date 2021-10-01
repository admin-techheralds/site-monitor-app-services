
const devicesRouter = require('express').Router();
const Device = require('../models/device')
const S = require('string');


devicesRouter.get('/:org_id/:site_id', async (req, res) => {
  console.log("Listing all the devices from DB for the selected org/site")
  const user = req['loggedin-user'];
  // console.log('User details:' + JSON.stringify(user))
  if(! user) {
    console.log('The user details are not found in the request for querying the devices');
    return res.status(500).json({
        error: 'User details are not found in the request to list the devices',
    });
  }

  var org_id = req.params.org_id;
  var site_id = req.params.site_id;
  if(S(org_id).isEmpty() || S(site_id).isEmpty()) {
    console.log("Organization id / Site ID is not found in the request to list the sites")
    return res.status(500).json({
      error: 'Mandatory parameters are not found in the request to list the devices',
    });
  }
  org_id = S(org_id).trim().s
  site_id = S(site_id).trim().s
  const devicesList = await Device.find({org_id : parseInt(org_id), site_id : parseInt(site_id)});
  return res.status(200).json({
      status:'OK',
      devices: devicesList
  });
});

devicesRouter.post('/:org_id/:site_id', async (req, res) => {
  console.log("Creating device from POST request")
  const user = req['loggedin-user'];
  var org_id = req.params.org_id;
  var site_id = req.params.site_id;
  if(! user) {
    return res.status(500).json({
      error: 'User details are not found in the request to create the organization',
    });
  }

  if(S(org_id).isEmpty() || S(site_id).isEmpty()) {
    console.log("Organization id / Site ID is not found in the request to create a device")
    return res.status(500).json({
      error: 'Mandatory parameters are not found in the request to create a device',
    });
  }
  org_id = S(org_id).trim().s
  site_id = S(site_id).trim().s

  const user_id = user.uid
  var deviceDetails = req.body;
  deviceDetails['org_id'] = parseInt(org_id)
  deviceDetails['site_id'] = parseInt(site_id)
  console.log("Creating the site with data", deviceDetails);
  const device = new Device(deviceDetails);
  const createdDeviceDetails = await device.save();
  return res.status(200).json({
      status: 'OK',
      data : createdDeviceDetails
  });
});


module.exports = devicesRouter;
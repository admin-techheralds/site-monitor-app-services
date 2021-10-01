
const videosRouter = require('express').Router();
const Video = require('../models/video')
const S = require('string');


videosRouter.get('/:org_id/:site_id/:device_id', async (req, res) => {
  console.log("Listing all the videos from DB for the selected org/site/device")
  const user = req['loggedin-user'];
  // console.log('User details:' + JSON.stringify(user))
  if(! user) {
    console.log('The user details are not found in the request for querying the videos');
    return res.status(500).json({
        error: 'User details are not found in the request to list the videos',
    });
  }

  var org_id = req.params.org_id;
  var site_id = req.params.site_id;
  var device_id = req.params.device_id;
  if(S(org_id).isEmpty() || S(site_id).isEmpty() || S(device_id).isEmpty()) {
    console.log("Organization id / Site ID / Device id is not found in the request to list the videos")
    return res.status(500).json({
      error: 'Mandatory parameters are not found in the request to list the videos',
    });
  }
  org_id = S(org_id).trim().s
  site_id = S(site_id).trim().s
  device_id = S(device_id).trim().s
  const videosList = await Video.find(
    {
      org_id : parseInt(org_id), 
      site_id : parseInt(site_id), 
      device_id : parseInt(device_id) 
    });
  return res.status(200).json({
      status:'OK',
      videos: videosList
  });
});
;


module.exports = videosRouter;
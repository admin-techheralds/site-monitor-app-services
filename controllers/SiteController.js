
const sitesRouter = require('express').Router();
const Site = require('../models/site')
const S = require('string');


sitesRouter.get('/:org_id', async (req, res) => {
  console.log("Listing all the sites from DB for the selected org")
  const user = req['loggedin-user'];
  // console.log('User details:' + JSON.stringify(user))
  if(! user) {
    console.log('The user details are not found in the request for querying the sites');
    return res.status(500).json({
        error: 'User details are not found in the request to list the sites',
    });
  }

  var org_id = req.params.org_id;
  if(S(org_id).isEmpty()) {
    console.log("Organization id is not found in the request to list the sites")
    return res.status(500).json({
      error: 'Mandatory parameters are not found in the request to list the sites',
    });
  }
  org_id = S(org_id).trim().s
  const sitesList = await Site.find({org_id : parseInt(org_id)});
  const userSiteList = sitesList.filter(site => { 
          const acl = site['acl'];
          if(acl == undefined) return;
          return acl.get(user.uid) != undefined ? site : undefined
      }
  )
  return res.status(200).json({
      status:'OK',
      sites: userSiteList
  });
});

sitesRouter.post('/:org_id', async (req, res) => {
  console.log("Creating site from POST request")
  const user = req['loggedin-user'];
  var org_id = req.params.org_id;
  if(! user) {
    return res.status(500).json({
      error: 'User details are not found in the request to create the organization',
    });
  }

  if(S(org_id).isEmpty()) {
    console.log("Organization id is not found in the request to create a site")
    return res.status(500).json({
      error: 'Mandatory parameters are not found in the request to create a site',
    });
  }
  org_id = S(org_id).trim().s

  const user_id = user.uid
  var siteDetails = req.body;
  var acl = {}
  acl[user_id] = {
      role_id: 0              //since user is creating the org, he/she shall have the admin role to govern
  }
  siteDetails['acl'] = acl
  siteDetails['org_id'] = parseInt(org_id)
  console.log("Creating the site with data", siteDetails);
  const site = new Site(siteDetails);
  const createdSiteDetails = await site.save();
  return res.status(200).json({
      status: 'OK',
      data : createdSiteDetails
  });
});


module.exports = sitesRouter;
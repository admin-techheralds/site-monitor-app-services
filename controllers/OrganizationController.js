const orgsRouter = require('express').Router();
const Org = require('../models/organisation')

orgsRouter.get('/', async (req, res) => {
    console.log("Listing all the organizations from DB")
    const user = req['loggedin-user'];
    // console.log('User details:' + JSON.stringify(user))
    if(! user) {
        console.log('The user details are not foundin the request for querying the orgalizations');
        return res.status(500).json({
            error: 'User details are not found in the request to list the organizations',
        });
    }
    const orgsList = await Org.find({});
    const userOrgList = orgsList.filter(org => { 
            const acl = org['acl'];
            if(acl == undefined) return;
            return acl.get(user.uid) != undefined ? org : undefined
        }
    )
    return res.status(200).json({
        status:'OK',
        orgs: userOrgList
    });
});

orgsRouter.post('/', async (req, res) => {
    console.log("Creating an organization from POST request")
    const user = req['loggedin-user'];
    if(user) {
        const user_id = user.uid
        var orgDetails = req.body;
        var acl = {}
        acl[user_id] = {
            role_id: 0              //since user is creating the org, he/she shall have the admin role to govern
        }
        orgDetails['acl'] = acl
        console.log("Creating the org with data", orgDetails);
        const org = new Org(orgDetails);
        const createdOrgDetails = await org.save();
        return res.status(200).json({
            status: 'OK',
            data : createdOrgDetails
        });
    } else {
        return res.status(500).json({
            error: 'User details are not found in the request to create the organization',
        });
    }
});

module.exports = orgsRouter;
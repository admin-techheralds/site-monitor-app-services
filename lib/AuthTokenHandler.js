const firebaseAdmin = require('firebase-admin');
const firebaseServiceAccountDetails = require('../config/site-monitor-app.json');
const settings = require('../config/settings.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccountDetails),
    databaseURL: settings.FIREBASE_DATABASE_URL
})

//not used the following
getUserDetailsFromRequestAuthToken = async function(req, res, next) {
    const bearerHeaderFromRequest = req.headers.authorization;
    console.log("Bearer Auth header:" + bearerHeaderFromRequest);
    if(bearerHeaderFromRequest !== undefined 
        && bearerHeaderFromRequest !== "Bearer null" 
        && bearerHeaderFromRequest.startsWith("Bearer ")) {
            const index = bearerHeaderFromRequest.indexOf(" ");
            const tokenValue = bearerHeaderFromRequest.substring(index);

            console.log("Token value is:" + tokenValue);
            if(tokenValue.trim().length > 0) {
                try {
                    const userDetails = await firebaseAdmin.auth().verifyIdToken(tokenValue.trim());
                    if(userDetails) {
                        req['loggedin-user'] = userDetails;
                    }
                } catch(ex) {
                    console.log('Exception while getting the token from the request. Ex:' + ex);
                }
            }
    }
    next();
}


validateUserDetailsFromRequestAuthToken = async function(req, res, next) {
    const bearerHeaderFromRequest = req.headers.authorization;
    if(bearerHeaderFromRequest !== undefined 
        && bearerHeaderFromRequest !== "Bearer null" 
        && bearerHeaderFromRequest.startsWith("Bearer ")) {
            const index = bearerHeaderFromRequest.indexOf(" ");
            const tokenValue = bearerHeaderFromRequest.substring(index);
            // console.log("Token value is:" + tokenValue);
            if(tokenValue.trim().length > 0) {
                try {
                    const userDetails = await firebaseAdmin.auth().verifyIdToken(tokenValue.trim());
                    if(userDetails) {
                        req['loggedin-user'] = userDetails;
                        next();
                        return;
                    } else {
                        console.log('Failed to get the user details for the given auth token found in the request')
                    }
                } catch(ex) {
                    console.log('Exception while getting the user details from token found in the request. Ex:' + ex);
                }
            } else {
                console.log("Authorization token is found to be invalid");
            }
    } else {
        console.log("Request doesnt contain the authorization header")
    }

    //sending the not authorized response on failure
    res.status(403).json({
        error: 'Not Authorized'
    })
}

module.exports = validateUserDetailsFromRequestAuthToken;

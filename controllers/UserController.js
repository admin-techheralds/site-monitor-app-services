
const usersRouter = require('express').Router();

usersRouter.get('/', (req, res) => {
    console.log("Listing all the users from DB")
    const user = req['loggedin-user'];
    console.log('User details:' + JSON.stringify(user))
    return res.status(200).json({
        status:'OK',
        users: [
        ]
    });
});

usersRouter.post('/', (req, res) => {
    console.log("Creating a User from POST request")
    const user = req['loggedin-user'];
    console.log('User details:' + JSON.stringify(user))
    return res.status(200).json({
        status:'OK'
    });
});

module.exports = usersRouter;
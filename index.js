const settings = require('./config/settings.json');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');


startServer = function() {
    const app = express();

    const port = process.env.PORT || settings.PORT
    
    const userController = require('./controllers/UserController');
    const siteController = require('./controllers/SiteController');
    const orgController = require('./controllers/OrganizationController');
    const deviceController = require('./controllers/DeviceController');
    const videoController = require('./controllers/VideoController');

    const validateUserDetailsFromRequestAuthToken = require('./lib/AuthTokenHandler');
    
    app.use(cors())
    app.use(express.json())
    app.use(validateUserDetailsFromRequestAuthToken);
    
    app.use('/v1/users', userController);
    app.use('/v1/sites', siteController);
    app.use('/v1/orgs', orgController);
    app.use('/v1/devices', deviceController);
    app.use('/v1/videos', videoController);
    
    // app.get('/', (req, res) => {
    //     const user = req['loggedin-user'];
    //     console.log('User details:' + JSON.stringify(user))
    //     res.status(200).json( {
    //         status: 'OK'
    //     });
    // });
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    
}

mongoose.connect(
    settings.DB_URL,
    // 'mongodb+srv://foobar:foobar123@cluster0.ylunw.mongodb.net/phonebook?retryWrites=true&w=majority',
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }).then(() => {
       console.log('Connected to database');
        startServer();
    }).catch((err) => {
       console.log('Error connecting to DB', err.message);
    });



const mongoose = require('mongoose');

//collection name:devices
const deviceSchema = new mongoose.Schema({
    device_id: Number,
    device_name: String,
    device_description: String,
    device_vendor: String,
    device_model: String,
    device_loc: {
        type: Map
    },
    site_id: Number,
    org_id: Number,
    created_date: Date,
    modified_date: Date,
});

deviceSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
});
module.exports = mongoose.model('devices', deviceSchema);
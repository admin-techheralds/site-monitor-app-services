
const mongoose = require('mongoose');

//collection name:sites
const siteSchema = new mongoose.Schema({
    site_id: Number,
    site_name: String,
    site_description: String,
    site_address: String,
    site_owner: String,
    acl: {
        type: Map
    },
    org_id: Number,
    created_date: Date,
    modified_date: Date,
});

siteSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
});
module.exports = mongoose.model('sites', siteSchema);
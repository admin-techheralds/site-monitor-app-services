
const mongoose = require('mongoose');

//collection name:organizations
const orgSchema = new mongoose.Schema({
    org_id: Number,
    org_name: String,
    org_description: String,
    acl: {
        type: Map
    },
    created_date: Date,
    modified_date: Date
});

orgSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
});
module.exports = mongoose.model('organizations', orgSchema);
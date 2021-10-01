
const mongoose = require('mongoose');

//collection name:devices
const videoSchema = new mongoose.Schema({
    device_id: Number,
    video_url: String,
    video_preview_image_url: String,
    meta_data: {
        type: Map
    },
    device_id: Number,
    site_id: Number,
    org_id: Number,
    created_date: Date,
    modified_date: Date,
});

videoSchema.set('toJSON', {
    transform: (doc, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
});
module.exports = mongoose.model('videos', videoSchema);
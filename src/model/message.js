const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


let messageSchema = mongoose.Schema({
  body: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
	timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);
const mongoose = require('mongoose');

var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

const LobbySchema = new mongoose.Schema({

  owner: {
      type: ObjectId,
      required: true,
      ref: "users"
    },
  player1: {
    id: {
    type: ObjectId,
    required: false,
    ref: "users"
  },
  name: {
    type: String,
  }
},
  player2: {
    id: {
    type: ObjectId,
    required: false,
    ref: "users"
  },
  name: {
    type: String,
  }
  },
  viewers: {
    type: Array,
    default: []
  }

})


module.exports = mongoose.model('Lobby', LobbySchema);

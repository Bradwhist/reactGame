const mongoose = require('mongoose');

var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId

const GameSchema = new mongoose.Schema({

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
  },
  lobby: {
    type: ObjectId,
    required: false,
    ref: "lobby"
  }

})


module.exports = mongoose.model('Game', GameSchema);

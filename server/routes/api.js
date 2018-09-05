const express = require('express');
const User = require('../models/User');
const Lobby = require('../models/Lobby');
const router = new express.Router();

router.use((req, res, next) => {

  if (!req.headers.token) {
    return res.send('no token in request, gg no re');
  }
  User.findOne({token: req.headers.token})
  .then(user => {
    if (!user) {
      return res.send('token no good.  construct additional tokens');
    }
    res.locals.user = user;
    next();
  })
  .catch(err => console.log('error in middleware', err))
});

// router.post('/game', (req, res) => {
//   var newGame = new Game({
//     owner: res.locals.user._id,
//     player1: res.locals.user._id,
//   })
//   newGame.save()
//   .then(response => res.json(newGame));
//   .catch(err => {
//     console.log(err);
//     res.send(err)
//   })
// })

router.post('/lobby', (req, res) => {
  var newLobby = new Lobby({
    owner: res.locals.user._id,
  })
  newLobby.save()
  .then(response => res.json(newLobby))
  .catch(err => res.send(err))
})

router.get('/checkUser', (req, res) => {
  console.log('token in checkuser route', req.headers.token);
  User.findOne({ token: req.headers.token })
  .then(user => {
    res.json(user);
  })
  .catch(err => console.log(err))
})

router.get('/lobby', (req, res) => {
  Lobby.find().exec()
  .then(lobbies => res.json(lobbies))
  .catch(err => console.log(err))
})

router.get('/lobby/byId/:id', (req, res) => {
  Lobby.findById(req.params.id)
  .then(lobby => {
    res.json(lobby);
  })
  .catch(err => console.log(err))
})

module.exports = router;

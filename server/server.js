
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {});

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var session = require('express-session');
// var cors = require('cors');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
mongoose.connect(process.env.MONGODB_URI);
var Models = require('./models');
var Lobby = require('./models/Lobby');
var authRoutes = require('./routes/auth.js');
var apiRoutes = require('./routes/api.js');
var cors = require('cors');
const User = require('./models/User');
const Game = require('./models/Game');
app.options('*', cors());

app.get('/', function(req, res, next) {
 res.send('found me');
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser())

app.use(session({
  secret: process.env.jwtSecret,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
 }));
app.use(passport.initialize());
app.use(passport.session());
// Passport Serialize
passport.serializeUser(function(user, done){
  console.log('serialize user: user', user);
  done(null, user._id);
});
// Passport Deserialize

passport.deserializeUser(function(id, done) {
  Models.User.findById(id, function(err, user) {
    console.log('deserialize user: user', user);
    done(err, user);
  });
});

const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
//
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

 server.listen(8081);
io.on('connection', function(socket) {
  io.emit('connect', 'connected to server');

  socket.on('joinLobby', (data) => {
    console.log('join lobby');
    Lobby.findById(data.lobby)
    .then(lobby => {
      console.log('in join lobby', !lobby.player1.id)
      if (!lobby.player1.id ) {
        lobby.player1.name = data.user.name;
        lobby.player1.id = data.user._id;
        socket.emit('assignSlot', 0);
      } else if (!lobby.player2.id) {
        lobby.player2.name = data.user.name;
        lobby.player2.id = data.user._id;
        socket.emit('assignSlot', 1);
        } else {
          socket.emit('assignSlot', lobby.viewers.length + 2);
          lobby.viewers.push({ name: data.user.name, id: data.user._id });
        }
        lobby.save();
      })

    socket.join(data.lobby);
    socket.broadcast.in(data.lobby).emit('joinedLobby', data.user);
})

socket.on('leaveLobby', (data) => {
  Lobby.findById(data.lobby)
  .then(lobby => {
    if (data.user === lobby.player1) {
      lobby.player1 = null;
    } else if (data.user === lobby.player2) {
      lobby.player2 = null;
    } else {
      let removeIndex = lobby.viewers.indexOf(data.user);
      lobby.viewers.splice(removeIndex, 1);
    }
    lobby.save();
  })
  socket.leave(data.lobby);
  socket.broadcast.in(data.lobby).emit('leftLobby', data.user)
})

socket.on('startGame', (data) => {
  io.in(data.lobby).emit('startGame')
  // if (!req.headers.token) {
  //   return res.send('no token in request, gg no re');
  // }
  User.findOne({token: data.token})
  .then(user => {
    // if (!user) {
    //   return res.send('token no good.  construct additional tokens');
    // }
    Lobby.findById(data.lobby)
    .then(lobby => {
      console.log('XXXXXXXXXXX', lobby)
      let newGame = new Game({
        player1: lobby.player1,
        player2: lobby.player2,
        viewers: lobby.viewers,
        lobby: lobby._id
      })
      console.log(newGame);
      newGame.save();
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
})

  // socket.on('newLobby', (data) => {
  //   console.log('new lobby', data.lobby);
  //   socket.to(data.lobby).emit('joined', data.user)
  // })

  // socket.on('testRoom', (data) => {
  //   console.log('this far', data)
  //   socket.join('joinLobbyTest');
  //   io.in('joinLobbyTest').emit('testRoom', data)
  // })
  //
  // socket.on('room', function(data) {
  //   socket.broadcast.to(data.doc).emit('joined', data.user);
  //   socket.join(data.doc);
  //
  // });
  // // new game listener
  // socket.on('newGame', function(data) {
  //   socket.broadcast.to(data.game).emit('new player', data.user);
  //   socket.join(data.game);
  // })
  //
  // socket.on('cmd', function (data) {
  //   console.log('cmd', data);
  //   io.emit('fuckolly', 'fuckolly');
  // });

});

app.set('port', 8080);

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`)
})

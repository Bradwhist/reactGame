import axios from 'axios';

import { SIGNUP, LOGIN, GAME_START, GAME_PLAY, FETCH_USER, NEW_GAME, FETCH_LOBBIES, FETCH_LOBBY, JOIN_LOBBY, ASSIGN_SLOT } from './types';
import io from 'socket.io-client';
import {messageTypes, uri} from '../constants/websockets.js';
const socket = io( uri );


// if redux-thunk sees that we're returning a function in
// an action creator instead of an action
// redux thunk will automatically call this function and pass in dispatch as an argument

/////////////////////////////////////////// Fetch user
export const fetchUser = () => async dispatch => {
  // we do not want to dispatch an action until this request is completed

  let user = localStorage.getItem('user');
  //console.log(JSON.parse(user).token);
  if (user) {
  const res = await axios.get('http://localhost:8080/api/checkUser/', {
    headers: { token: JSON.parse(localStorage.getItem('user')).token }
  }
  );
  dispatch({ type: FETCH_USER, payload: res.data });
} else {
  dispatch({ type: FETCH_USER, payload: false });
}
};
/////////////////////////////////////////// Fetch lobbies
export const fetchLobbies = () => async dispatch => {
  try {
  const res = await axios.get('http://localhost:8080/api/lobby', {
    headers: { token: JSON.parse(localStorage.getItem('user')).token }
  })
  dispatch({ type: FETCH_LOBBIES, payload: res.data });
  }
  catch(err){ console.log(err) }
}
//////////////////////////////////////////////
export const fetchLobby = (lobbyId) => async dispatch => {
  try {
    const res = await axios.get('http://localhost:8080/api/lobby/byId/' + lobbyId, {
      headers: { token: JSON.parse(localStorage.getItem('user')).token }
    })
    dispatch({ type: FETCH_LOBBY, payload: res.data })
    return 'meow';
  }
  catch(err){ console.log(err) }
}
///////////////////////////////////////////////
export const assignSlot = (slot) => async dispatch => {
  try {
    dispatch({ type: ASSIGN_SLOT, payload: slot })
  }
  catch(err){ console.log(err) }
}
///////////////////////////////////// Post Routes/
//////////////////////////////////// New lobby
export const newLobby = () => async dispatch => {
  try {
    const res = await axios.post('http://localhost:8080/api/lobby', {
    }, {
      headers: { token: JSON.parse(localStorage.getItem('user')).token }
    })
    socket.emit('newLobby', { user: JSON.parse(localStorage.getItem('user')).token, lobby: res.data._id });

    return res.data._id;
  }
  catch(err){console.log(err)}
}
/////////////////////////////////////////////// Join lobby
export const joinLobby = (lobbyId, user) => async dispatch => {
  try {
    console.log('join lobby', lobbyId, user);
    socket.emit('joinLobby', { user: user, lobby: lobbyId})
    dispatch({ type: JOIN_LOBBY, payload: null })
  }
  catch(err){console.log(err)}
}
// FETCH Actions

//Fetch User

export const gameStart = () => async dispatch => {
  // we do not want to dispatch an action until this request is completed
  //console.log(localStorage)
//   let user = localStorage.getItem('user');
//   //console.log(JSON.parse(user).token);
//   if (user) {
//   const res = await axios.get('http://localhost:8080/api/checkUser/', {
//     headers: { token: JSON.parse(localStorage.getItem('user')).token }
//   }
//   );
//   //console.log(res);
//   dispatch({ type: FETCH_USER, payload: res.data });
// } else {
//   dispatch({ type: FETCH_USER, payload: false });
// }

};

//////////////////////////////////////////////
// Auth Routes

export const login = (email, password) => async dispatch => {
try {
  const res = await axios({
    method: 'post',
    url: 'http://localhost:8080/auth/login',
    data: {
      email: email,
      password: password,
    },
  });
  localStorage.setItem('user', JSON.stringify(res.data));
  dispatch({ type: LOGIN, payload: res.data});
}
catch(err){console.log(err)}
}

export const signup = (name, email, password) => async dispatch => {
  try {
  const res = await axios.post('http://localhost:8080/auth/signup', {
    name: name,
    email: email,
    password: password,
  }
);
dispatch({ type: SIGNUP, payload: res.data });
}
catch(err){console.log(err)}
}

///////////////////////////////////////////////////////////////

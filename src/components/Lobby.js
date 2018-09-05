import React, { Component } from 'react'
import { Button, Header, Image, Icon, Modal, Input, Message } from 'semantic-ui-react'
import { Route, Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { joinLobby, fetchLobby, assignSlot } from '../actions'
import io from 'socket.io-client';
import {messageTypes, uri} from '../constants/websockets.js';
const socket = io( uri );


class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    let _this = this;
    socket.emit('joinLobby', { user: this.props.auth.logged, lobby: this.props.match.params.id })
    let myTime = setTimeout(this.props.fetchLobby(this.props.match.params.id), 500)
    clearTimeout(myTime);
    //this.props.joinLobby(this.props.match.params.id, this.props.auth.logged._id);
    socket.on('joinedLobby', function(data){
      console.log('joined');
      _this.props.fetchLobby(_this.props.match.params.id)
    });
    socket.on('leftLobby', (data) => {console.log('left')});
    socket.on('connect', (data) => {console.log(data)});
    socket.on('testRoom', () => console.log('mraw'));
    socket.on('assignSlot', (data) => this.props.assignSlot(data));
    socket.on('startGame', () => this.props.history.push('/game'));
  }

  reloadTest(e) {
    e.preventDefault();
    this.props.fetchLobby(this.props.match.params.id);
  }


  newLobby = async (e) => {
    e.preventDefault();
    const res = await this.props.newLobby();
    this.props.history.push('/lobby/' + res);
  }


  testRoom(e) {
    e.preventDefault();
    socket.emit('testRoom', this.props.match.params.id)
  }

  logout() {
    localStorage.removeItem('user');
  }

  dodgeGame(e) {
    e.preventDefault();
    socket.emit('leaveLobby', { user: this.props.auth.logged._id, lobby: this.props.match.params.id })
  }

  startGame(e) {
    e.preventDefault();
    socket.emit('startGame', { user: this.props.auth.logged._id, lobby: this.props.match.params.id, token: JSON.parse(localStorage.getItem('user')).token });
  }

  render() {
    console.log(this.props.gameStatus);
    return (
      <div className = "dashboard">
        <button onClick={(e) => this.reloadTest(e)}>Reload Test</button>
        This be the game lobby  { this.props.match.params.id } XXXX { this.props.auth.logged._id }
        <h2>Player 1:</h2>
        { this.props.lobby.player1 ? <p>{ this.props.lobby.player1.name }</p> : null }
        <h2>Player 2:</h2>
        { this.props.lobby.player2 ? <p>{ this.props.lobby.player2.name }</p> : null }
        <h2>Viewers:</h2>
        {this.props.lobby.viewers ?
        <ul>
        {this.props.lobby.viewers.map((ele, i) => <li>ele</li>)}
        </ul>
      : null }
        <button onClick={(e) => this.testRoom(e)}>tdt</button>
        <button onClick={(e) => this.startGame(e)}>Start Game</button>
        <button onClick={(e) => this.dodgeGame(e)}>Dodge Game</button>
        <button onClick={this.logout}>logout</button>
      </div>
    )
  }


}

const mapStateToProps = ({ auth, lobby, gameStatus }) => {
    return {
      auth,
      lobby,
      gameStatus
    }
  }


const mapDispatchToProps = (dispatch) => {
  return {
    joinLobby: (lobbyId, user) => dispatch(joinLobby(lobbyId, user)),
    fetchLobby: (lobbyId) => dispatch(fetchLobby(lobbyId)),
    assignSlot: (slot) => dispatch(assignSlot(slot)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Lobby);

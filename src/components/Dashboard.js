import React, { Component } from 'react'
import { Button, Header, Image, Icon, Modal, Input, Message } from 'semantic-ui-react'
import { Route, Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { newLobby, joinLobby, fetchLobbies } from '../actions'


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {

    this.props.fetchLobbies();
  }

  newLobby = async (e) => {
    e.preventDefault();
    const res = await this.props.newLobby();
    this.props.history.push('/lobby/' + res);

  }

  joinLobby(lobbyId) {
    this.props.joinLobby(lobbyId, this.props.auth.logged)
    this.props.history.push('/lobby/' + lobbyId);
  }

  render() {
    console.log(this.props.lobbies);

    return (
      <div className = "dashboard">
        <button onClick={(e) => this.newLobby(e)}>Create new game</button>
        <ul>
        { this.props.lobbies.map((ele, i) => {
          return <li>
          <button onClick={() => this.joinLobby(ele._id)}>{i}</button>
          </li>
        })
         }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = ({ auth, lobbies }) => {
    return {
      auth,
      lobbies
    }
  }

const mapDispatchToProps = (dispatch) => {
  return {
    newLobby: () => dispatch(newLobby()),
    joinLobby: (lobbyId, user) => dispatch(joinLobby(lobbyId, user)),
    fetchLobbies: () => dispatch(fetchLobbies()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

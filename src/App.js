import React, { Component } from 'react';

import { CSSTransitionGroup } from 'react-transition-group';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { fetchUser } from './actions';

import './App.css';

import { connect } from 'react-redux'
// import './Animations.css';
// import './Filters.css';

import io from 'socket.io-client';
import {messageTypes, uri} from './constants/websockets.js';

import Home from './components/Home';
import Game from './components/NewGame';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Lobby from './components/Lobby';
const socket = io( uri );

export const init = ( store ) => {
  Object.keys( messageTypes )
  .forEach( type => socket.on( type, ( payload ) =>
  store.dispatch({ type, payload })
)
)
}

class App extends Component {
  constructor(props) {
    super(props);
  //  const hexagons = GridGenerator.hexagon(2);
    //const hexagons = [{q: 1, r: 0, s: 0, text: 'meow'}]

// Set additional data for hexagons

this.state = {

};

};

componentDidMount() {
  this.props.fetchUser();
}





  render() {
    console.log(this.props.auth.logged && this.props.auth.loaded);
    return (
      <Router>
      <div className="App">
      <Route exact path = '/' component = {Home} />
      <Route exact path = '/login' component = {Login} />
      {this.props.auth.logged && this.props.auth.loaded ?
        <Switch>
          <Redirect exact from = '/login' to = '/dashboard' />
          <Route exact path = '/' component={Home} />
          <Route exact path = '/dashboard' component={Dashboard} />
          <Route exact path = '/game' component={Game} />
          <Route exact path = '/lobby/:id' component={Lobby} />
        </Switch>
        :
        this.props.auth.loaded ?
        <Switch>
        <Redirect from='/' to='/' />
        </Switch>
        : null
      }
      </div>
      </Router>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: () => dispatch(fetchUser()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import PropTypes from 'prop-types'
import logo from '../logo.svg';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import io from 'socket.io-client';
import {messageTypes, uri} from '../constants/websockets.js';
import GameLayout from '../layouts/GameLayout';
import TilesLayout from '../layouts/TilesLayout';
import { GridGenerator, HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex, HexUtils } from 'react-hexgrid';
import { Tooltip } from 'reactstrap';
import { Overlay } from 'react-overlays';
import { findDOMNode } from 'react-dom';
const socket = io( uri );

class Game extends Component {
  constructor(props) {
    super(props);
    const hexagons = GridGenerator.hexagon(2);
    hexagons.forEach(hex => {
      hex.pattern = "pattern1";
    });
    this.state = {
      hexagons,
      zoom: 50,
      tooltipOpen: false,
    };
  }

  componentDidMount() {
    this.setState({ tooltipOpen: true })
    socket.on('connect', (data) => {
      console.log('connected', data);
    })
    socket.on('fuckolly', (data) => {
      console.log(data);
    })

  }

  toggleOverlay() {
    this.setState({ tooltipOpen: true })
  }

  sendCmd() {
    socket.emit('cmd', 'cmd message');
  }

  startLobby() {
    socket.emit('createRoom');
  }

  zoomChange(event) {
    this.setState({ zoom: event.target.value })
  }
  zoomInc() {
    console.log(this.state.zoom);
    let newZoom = this.state.zoom + 10;
    newZoom = newZoom - (newZoom % 10);
    if (newZoom === 110) {
      newZoom = 100;
    }
    this.setState({zoom: newZoom})
  }

  zoomDec() {
    let newZoom = this.state.zoom - 10;
    newZoom = newZoom + (newZoom % 10);
    if (newZoom === 0) {
      newZoom = 1;
    }
    this.setState({zoom: newZoom})
  }

  onClick(event, source) {
  // Get our hexagon data
  const { hexagons } = this.state;

  // Go through all of our hexagons and update patterns
  const hexas = hexagons.map(hex => {
    // Switch pattern only for the hexagon that was clicked
    if (HexUtils.equals(source.state.hex, hex)) {
      // Assign new pattern to _our_ data
      hex.pattern =
        source.props.fill === "pattern1" ? "pattern2" : "pattern1";
    }

    return hex;
  });

  // Save our new hexagon data to the state, which will cause a re-render
  this.setState({ hexagons: hexas });
}

render() {
  console.log(this.state.tooltipOpen)
  let { hexagons } = this.state;
  return (
<div>
<h2>Drag & drop</h2>
<p>Drag tiles from the right-side grid and drop them to the left grid.</p>
<p>You can also drag & drop them within the left board, but not back to the right side.</p>
<p>
<small>
TilesLayout (on the right) does not handle `onDrop` and `onDragOver` and that's why it's not possible to drop anything on these tiles.
GameLayout (on the left) handles all the events, so its possible to start a drag as well as drop tiles.
It also implements custom check to disallow drop on certain tiles, like the ones that are blocked or
already have content in them.
</small>
</p>
<p>{this.state.zoom}</p>
<button onClick={() => this.zoomDec()}>-</button>
<button onClick={() => this.zoomInc()}>+</button>
<div class="slidecontainer">
<input onChange={(e) => this.zoomChange(e)}type="range" min="1" max="100" value={this.state.zoom} class="slider" id="myRange"/>
</div>
<div style={{overflow: 'scroll', height: 750, width: 1500}}>
{/* <HexGrid width={4800} height={4000} viewBox="-200 -200 400 400"> */}
{/* width={480 + 43.2 * this.state.zoom} height={400 + 36 * this.state.zoom} */}
{/* {"" + (-20 - 8.3 * this.state.zoom) + ' ' + (-20 - 8.3 * this.state.zoom) + ' ' + (40 + 16.6 * this.state.zoom) + ' ' + (40 + 16.6 * this.state.zoom)} */}
<HexGrid width={480 + 43.2 * this.state.zoom} height={400 + 36 * this.state.zoom} viewBox="-200 -200 400 400">
<GameLayout toggleOverlay={() => this.toggleOverlay()} />
</HexGrid>
</div>
<HexGrid width={1600} height={1000} viewBox="-10 -50 100 100">
<TilesLayout />
</HexGrid>

{this.refs.hex1 ?
<Overlay
show={this.state.tooltipOpen}
target={props => findDOMNode(this.refs.hex1)}
>
<Tooltip>MEOW</Tooltip>
</Overlay>
: null }


  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <h1 className="App-title">Welcome to React</h1>
  </header>
  <p className="App-intro">
    To get started, edit <code>src/App.js</code> and save to reload.
  </p>
  <button onClick={() => this.sendCmd()}>Send Command</button>
  </div>

)}

}

const mapStateToProps = ({}) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)

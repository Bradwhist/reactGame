import PropTypes from 'prop-types'
import logo from '../logo.svg';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import io from 'socket.io-client';
import {messageTypes, uri} from '../constants/websockets.js';
import GameLayout from '../layouts/GameLayout';
import TilesLayout from '../layouts/TilesLayout';
import GameBoard from '../layouts/GameBoard';
import { GridGenerator, HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex, HexUtils } from 'react-hexgrid';
import { Tooltip } from 'reactstrap';
import { Overlay } from 'react-overlays';
import { findDOMNode } from 'react-dom';
//import hexGrid from 'hex-grid';
import asyncImage from '../images/async.png';
import Hexagons from './Hexagons';
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
  let renderHexagons = Hexagons;



//var res = grid({ width: 45*3+10 }, { width: 45, height: 60, n: 10 });
  let styles = {position: 'relative'}
  let styles2 = {position: 'absolute'}


  return (
<div>
  { Hexagons }
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

// <Layout
//   size={{ x: 10, y: 10 }}
//   flat={false}
//   spacing={1.1}
//   origin={{ x: 0, y: 0 }}
// >
//   {hexagons.map((hex, i) => (
//     <Hexagon
//       key={i}
//       q={hex.q}
//       r={hex.r}
//       s={hex.s}
//       /* Here we pass the pattern which we want to display */
//       fill={hex.pattern}
//       /* onClick event gets back 2 properties: event and source (hexagon) */
//       onClick={(e, h) => this.onClick(e, h)}
//     >
//       <Text>{HexUtils.getID(hex)}</Text>
//     </Hexagon>
//   ))}
//   <Pattern id="pattern1" link="https://picsum.photos/200?image=80" />
//   <Pattern id="pattern2" link="https://picsum.photos/200?image=82" />
// </Layout>

import React, { Component } from 'react';
//import { GridGenerator, Layout, Hexagon, Text, Pattern, HexUtils } from 'react-hexgrid';
//import './GameLayout.css';
//import { Overlay } from 'react-overlays';
//import { findDOMNode } from 'react-dom';
//import { Tooltip } from 'reactstrap';
import { Surface } from 'react-art';
import HexGrid from './HexGrid';
import displayHelper from '../utilities/displayHelper';

class GameBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {

     };
  }

  componentDidMount() {

  }
  componentWillMount() {

  }

  render() {
    return (
      <Surface>
        <HexGrid hexCountHorizontal='25' hexCountVertical='13' />
      </Surface>
    );
  }
}

export default GameBoard;

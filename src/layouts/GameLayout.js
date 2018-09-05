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
import { GridGenerator, Layout, Hexagon, Text, Pattern, HexUtils } from 'react-hexgrid';
import './GameLayout.css';
import { Overlay } from 'react-overlays';
import { findDOMNode } from 'react-dom';
import { Tooltip } from 'reactstrap';

class GameLayout extends Component {
  constructor(props) {
    super(props);
    const hexagons = GridGenerator.hexagon(10);
    // Add custom prop to couple of hexagons to indicate them being blocked
    hexagons[0].blocked = true;
    hexagons[1].blocked = true;
    this.state = {
      hexagons,
      tooltipOpen: false,
     };
  }

  componentDidMount() {

  }

  // onDrop you can read information of the hexagon that initiated the drag
  onDrop(event, source, targetProps) {
    console.log(targetProps);
    console.log(source);
    const { hexagons } = this.state;
    const hexas = hexagons.map(hex => {
      // When hexagon is dropped on this hexagon, copy it's image and text
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.image = targetProps.data.image;
        hex.text = targetProps.data.text;
        hex.status = 'board';
      }
      return hex;
    });
    this.setState({ hexagons: hexas });
  }

  onDragStart(event, source) {
    // If this tile is empty, let's disallow drag
    if (!source.props.data.text) {
      event.preventDefault();
    }

  }

  // Decide here if you want to allow drop to this node
  onDragOver(event, source) {
    //console.log('game over');
    //console.log(source);
    // Find blocked hexagons by their 'blocked' attribute
    const blockedHexas = this.state.hexagons.filter(h => h.blocked);
    // Find if this hexagon is listed in blocked ones
    const blocked = blockedHexas.find(blockedHex => {
      return HexUtils.equals(source.state.hex, blockedHex);
    });

    const { text } = source.props.data;
    // Allow drop, if not blocked and there's no content already
    if (!blocked && !text) {
      // Call preventDefault if you want to allow drop
      event.preventDefault();
    }
  }

  // onDragEnd you can do some logic, e.g. to clean up hexagon if drop was success
  onDragEnd(event, source, success) {
// console.log('game end');
    if (!success) {
      return;
    }
    // TODO Drop the whole hex from array, currently somethings wrong with the patterns

    const { hexagons } = this.state;
    // When hexagon is successfully dropped, empty it's text and image
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.text = null;
        hex.image = null;
      }
      return hex;
    });
    this.setState({ hexagons: hexas });
  }



  render() {
    console.log(this.refs.hex1);
    let position = {
      tooltip: { marginLeft: -3, padding: '0 5px' },
      arrow: {
        right: 0, marginTop: -5, borderWidth: '5px 5px 5px', borderLeftColor: '#000'
      }
    }
    let { hexagons } = this.state;
    return (
      <Layout ref='meow' className="game" size={{ x: 10, y: 10 }} flat={false} spacing={1.08} origin={{ x: -30, y: 0 }}>
        {
          hexagons.map((hex, i) => (
            <Hexagon
              onClick={() => this.props.toggleOverlay()}
              key={'hex' + i}
              ref={'hex' + i}
              id={'hex' + i}
              q={hex.q}
              r={hex.r}
              s={hex.s}
              className={hex.blocked ? 'blocked' : null}
              fill={(hex.image) ? HexUtils.getID(hex) : null}
              data={hex}
              onDragStart={(e, h) => this.onDragStart(e, h)}
              onDragEnd={(e, h, s) => this.onDragEnd(e, h, s)}
              onDrop={(e, h, t) => this.onDrop(e, h, t) }
              onDragOver={(e, h) => this.onDragOver(e, h) }
            >
              <Text id='test1'>{hex.text || HexUtils.getID(hex)}</Text>
              <p>MEOW</p>
              /*{ hex.image && <Pattern id={HexUtils.getID(hex)} link={hex.image} /> }*/
            </Hexagon>
          ))
        }


      </Layout>
    );
  }
}

export default GameLayout;

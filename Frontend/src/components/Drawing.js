import React, { Component } from 'react';
import DrawingLine from './DrawingLine';
class Drawing extends Component {

    render() {
      let lines = this.props.lines;
      return (
        <svg className="drawing">
          {lines.map((line, index) => (
            <DrawingLine key={index} line={line} />
          ))}
        </svg>
      );
    }
}
export default Drawing;

import React, { Component } from 'react';
class DrawingLine extends Component {

    render() {
    let line = this.props.line;
    const pathData = "M " +
    line
      .map(p => {
        return `${p.get('x')} ${p.get('y')}`;
      })
      .join(" L ");

        return <path className="path" d={pathData} />;
      }
}
export default DrawingLine;

   


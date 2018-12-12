import React, { Component } from 'react';
import { Fraction, toTex } from 'algebra.js';
import { Node, Context } from 'react-mathjax';

class Formula extends Component {
  render() {
    
        return (
            <Context input="tex">
              <Node inline>{this.props.tex}</Node>
            </Context>
          );
        
    
  }
}

export default Formula;
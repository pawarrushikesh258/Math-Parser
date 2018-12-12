import React, { Component } from 'react';
import 'katex/dist/katex.min.css';
import { ReactKaTeX, InlineMath, BlockMath } from 'react-katex';

class KatexDisp extends Component {
  render() {
   
    return (
     <div className="container">
       <InlineMath>\x ^ { 2 } + 2 x y + y ^ { 2 }</InlineMath>
    </div>
    );
  }
}

export default KatexDisp;
 
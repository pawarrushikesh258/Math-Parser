import React, { Component } from 'react';
import DrawArea from './DrawArea'


class MainPage extends Component {
  constructor(){
    super();
    this.state={
      itemAdded: false
    }
  }
    
  render() {
  
    return (
     <div className="container">
       <DrawArea/>
    </div>
    );
  }
}

export default MainPage;
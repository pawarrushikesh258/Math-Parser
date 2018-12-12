import React, { Component } from 'react';
import Nav from './Nav';
import ls from 'local-storage';
import MainPage from './MainPage';

class App extends Component {

  componentWillMount(){
    if(!ls.get("userData")){
      this.props.history.replace('/login');
    }
  }
  render() {

    return (
     <div className="container">
        <Nav/>
       
    </div>
    );
  }
}

export default App;
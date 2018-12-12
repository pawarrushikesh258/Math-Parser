import React, { Component } from 'react';
import Drawing from './Drawing';
import Immutable from 'immutable';
import axios from 'axios';
import katex from 'katex';
import ls from 'local-storage';
const { Map } = require("immutable");

class DrawArea extends Component{
  
  constructor() {
    super();

    this.state = {
      lines: new Immutable.List(),
      isDrawing: false,
      file:null,
      formula:null
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick= this.handleClick.bind(this);
    this.handleClear= this.handleClear.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    console.log(boundingRect)
    
    if (mouseEvent.clientX > boundingRect.left && mouseEvent.clientX < boundingRect.right && mouseEvent.clientY >  boundingRect.top && mouseEvent.clientY < boundingRect.bottom) {
    this.setState(prevState => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      isDrawing: true
    }));
   }
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    
    this.setState(prevState =>  ({
      lines: prevState.lines.updateIn([prevState.lines.size-1], line => line.push(point))
    }));
  }

  handleClick(event) {
   console.log(this.state.lines);
    var scg = 'SCG_INK\n' + (this.state.lines.size) + '\n';
    for (var i = 0; i < this.state.lines.size; i++ ){
      scg +=this.state.lines._tail.array[i].size + '\n';
      var line = this.state.lines._tail.array[i];
      line.map(p => {
       scg +=`${p.get('x')} ${p.get('y')}` +'\n';
      });
    }
    let user = ls.get('userData');
      axios.post("http://localhost:2000/getstrokeresult",{scg:scg, "username":user.userName}).then((res)=> {
          console.log('scg working');
          this.setState({formula:res.data});
      });
      event.preventDefault();

  }
  handleClear() {
    this.setState({lines: new Immutable.List(), isDrawing: false});
  }
  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }
  handleChange = event =>{
    this.setState({file:event.target.files[0]});
  }
  handleSubmit = event => {
      let userName = ls.get('userData');
    const formData = new FormData()
    formData.append('imgUploader', this.state.file, this.state.file.name);
   // formData.append('name',userName.userName);
    
    console.log(formData.get('myFile'));

    /*fetch('http://localhost:8080/result/addResult', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
    }
    console.log(response);
     
    });(/)*/
    //let userName = ls.get('userData');
    axios.post("http://localhost:2000/result/upload", formData,  {headers: {
      'Content-Type': 'multipart/form-data'
    }}).then((res)=>{
     this.setState({formula :res.data});
     let expression = res.data;
     let username = ls.get('userData').userName;

     axios.post("http://localhost:2000/savetodb/",{username:username,op:expression}).then((res)=>{
         console.log("result sent to db");
         console.log(res);
     })

    });
        event.preventDefault();
  }
  
    


  render() {
  
    var html =(this.state.formula ===null)? '': katex.renderToString(`{`+this.state.formula+`}`);
    // '<span class="katex">...</span>'
    return (
      <div>
        <h5 style={{"marginLeft": "430px","marginTop":"50px"}}>Draw a Math Expression</h5>
      <div
        className="drawArea"
        ref="drawArea"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
      >
      
        <Drawing lines={this.state.lines} />
        <button className="btn btn-primary"style={{"margin-left":"40%"}} onClick ={this.handleClick}> Process </button>
        <button className="btn btn-primary" style={{"margin-left":"10px"}} onClick ={this.handleClear}> Clear </button>
 
       
          <div className="mathpix">
          <h5 style={{"marginLeft": "100px"}}>Upload Math Image</h5>
              <form id="frmUploader" enctype="multipart/form-data" onSubmit={this.handleSubmit} >
                    <input type="file" onChange={this.handleChange} name="imgUploader" />
                    <input type="submit" className="btn btn btn-danger upButton" name="submit" id="btnSubmit" value="Upload" /> 
              </form>
          </div>
          <div className="displayArea" dangerouslySetInnerHTML={{__html:  html}}/>
          </div>
       </div>
    );
  }
}

export default DrawArea;

 





import React, { Component } from 'react';
import Nav from './Nav';
import MainPage from './MainPage';
import ls from 'local-storage';
import axios from 'axios'

import DrawArea from './DrawArea'
var ReactRouter = require('react-router-dom');
var Redirect = ReactRouter.Redirect;
class Home extends Component {
  constructor(){
    super();
    this.state= {
      default:[],
      ordered:[],
      spunk:[]
    }
  }

  componentWillMount(){
   
   
    axios.get("http://localhost:8080/products/getallproducts").then((resp)=>{
      //console.log(resp);
      this.setState({default:resp.data.data})
    });
  }
  handleOrder(item){
    console.log(item)
    let orderedItems = this.state.ordered;
    console.log(orderedItems)
    console.log("mark2")
    
    let found = false;
    item.quantity+=1;
    item.status= (item.available > item.quantity)?true:false;
  
    if(orderedItems.length===0){
      orderedItems.push(item);
      console.log("added item 1");
    }
    else{
      console.log("hey detective!!")
      var len = 0;
      orderedItems.find((x)=>{
        len++;
        if(x._id===item._id){
            found = true;
            orderedItems.quantity= orderedItems.quantity+1;
        }
        else{
          if(len === orderedItems.length && found===false){
            orderedItems.push(item);
            this.setState({ordered:orderedItems})
          }
        }
      
      }
    )
    }
    
    var ind=orderedItems.length-1;
    var email = ls.get("userData");
    axios.post("http://localhost:8080/cart/addtocart",{
      username:email,
			name: item.name,
      brand:item.brand,
      quantity: item.quantity,
      availability: item.availability,
      description: item.description,
      price: item.price,
      status: item.status
    }).then((res)=>{
      console.log(res);
    });
    

  }
  render() {
 
    
      return (
        <div className="container">
           <MainPage defaultDisplay={this.state.default} handleItem={this.handleOrder.bind(this)}/>
           
       </div>
       );
    
  }
}

export default Home;
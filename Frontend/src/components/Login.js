import React, { Component } from 'react';
import ls from 'local-storage';
import axios from 'axios';
var ReactRouter = require('react-router-dom');
var Redirect = ReactRouter.Redirect;
class Login extends Component {
    handleSubmit(e){
      
        var email =      this.refs.Email.value;
        var password =   this.refs.password.value;
        var rpassword =  this.refs.rpassword.value;
        var username =   this.refs.username.value;
        var firstname =  this.refs.FirstName.value;
        var lastname =   this.refs.LastName.value;
        var institute =  this.refs.Institute.value;

        if(password ===rpassword){
            axios.post("http://localhost:2000/signup",{email:email,password:password,username:username,firstname:firstname,lastname:lastname,institute:institute}).then((resp)=>{
                console.log(resp);
                if(resp.data.status === "false"){alert("Fill the form completely or try with another username");}
                else{
                    this.refs.Email.value = '';
                    this.refs.password.value = '';
                    this.refs.rpassword.value='';
                    this.refs.username.value = '';
                    this.refs.FirstName.value = '';
                    this.refs.LastName.value = '';
                    this.refs.Institute.value = '';
                    alert('user created');
                }
            });
            
        }
        else{
            alert("The passwords did not match")
        }
        e.preventDefault();
    }
  render() {
    if(ls.get("userData")){
   
      return( <Redirect  to="/Home"/>);
       
   }
   else{
        return (

            <div className="login">
            <Redirect  to="/Login"/>
                  <form className="signUp" onSubmit={this.handleSubmit.bind(this)}>
                        <div style={{marginTop:"50px"}}>
                            <div class="form-group col-md-6">
                                <div class="register"> Register</div>
                                <input type="text" ref="username" class="form-control" id="input1" placeholder="Username"/>
                            </div>
                            <div className="form-group col-md-6">

                                 <input type="text" ref="FirstName" class="form-control" id="input2" placeholder="First Name"/>
                            </div>
                            <div className="form-group col-md-6">

                                <input type="text" ref="LastName" className="form-control" id="input3"
                                       placeholder="Last Name"/>
                            </div>
                            <div className="form-group col-md-6">

                                <input type="email" ref="Email" className="form-control" id="input5"
                                       placeholder="Email"/>
                            </div>

                            <div class="form-group col-md-6">
                                <input type="password" ref="password" class="form-control" id="inputPassword4" placeholder="Password"/>
                            </div>
                            <div class="form-group col-md-6">
                                <input type="password"  ref="rpassword"class="form-control" id="inputPassword5" placeholder="Retype Password"/>
                            </div>
                            <div className="form-group col-md-6">
                                <input type="text" ref="Institute" className="form-control" id="input4"
                                       placeholder="Institute"/>
                            </div>
                        </div>
                <div className="signup_button">
                 <button type="submit" class="btn btn-primary" style={{width:"380px"}}>Sign up</button>
                 </div>
            </form>   
        </div>
        );
    }
  
  }
}

export default Login;
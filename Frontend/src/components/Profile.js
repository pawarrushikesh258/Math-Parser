import React, { Component } from 'react';
import ls from 'local-storage';


class Profile extends Component {
  constructor(){
    super();
   
  }
    
  render() {
    let data = ls.get("userData");
    
    return (
     <div className="container">
        <table class="table tab">
        
        <thead>
            <tr>
            <th scope="col" className="thead">User Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>Username</td>
            <td>{data.userName}</td>
            </tr>
            <tr>
            <td>First Name</td>
            <td>{data.firstName}</td>
            </tr>
            <tr>
            <td>Last Name</td>
            <td>{data.lastName}</td>
            </tr>
            <tr>
            <td> Email</td>
            <td>{data.email}</td>
            </tr>
            <tr>
            <td> Created On</td>
            <td>{data.createdDate}</td>
            </tr>
        </tbody>
        </table>
    </div>
    );
  }
}

export default Profile;
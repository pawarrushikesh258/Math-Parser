import React, { Component } from 'react';
import axios from 'axios';
import ls from 'local-storage';
import katex from 'katex';

class ResultHistory extends Component {
    constructor(){
        super();
        this.state={
            tableData: []
        }
    }




    componentWillMount(){
        let data = ls.get('userData');
        axios.post("http://localhost:2000/resulthistory",{username: data.userName}).then((res)=>{
            console.log("worked!");
            var sortByProperty = function (property) {

                return function (x, y) {

                    return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));

                };};

            var data = res.data.msg.data;
            data.sort(sortByProperty('result_id'));
            //console.log(res.data.msg.data);
            this.setState({tableData:data});
        });

    }

    render() {

        let table = this.state.tableData.map((elem,index)=>{
            let html = katex.renderToString(`{`+elem.latex_op+`}`)
            return(
                <tr>
                    <th scope="row">{elem.result_id}</th>
                    <td><div className="displaytable" dangerouslySetInnerHTML={{__html:  html}}/></td>
                    <td>{elem.date}</td>
                </tr>
            );
        })

        return (
            <div className="container">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Latex</th>
                        <th scope="col">Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {table}
                    </tbody>
                </table>

            </div>
        );
    }
}

export default ResultHistory;
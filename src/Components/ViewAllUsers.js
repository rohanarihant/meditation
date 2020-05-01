import React, {Component} from 'react';
import { getAllUsers, activateUser } from './apiCalls';
import Switch from "react-switch";

export default class ViewAllUsers extends Component {
    state = {
        allUsers: []
    }
    componentDidMount(){
        this.fetchAllUsers();
    }
    async fetchAllUsers(){
        this.props.toggleLoader();
        const response = await getAllUsers();
        this.setState({allUsers:response});
        this.props.toggleLoader();
    }
    async handleChange(phone) {
        this.props.toggleLoader();
        await activateUser(phone);
        this.props.toggleLoader();
        this.fetchAllUsers();
    }
    render() {
        const { allUsers } = this.state;
        return(
            <div>
                {/* <input type="date" value={startDate} onChange={data => this.handleChange(data)} dateformat="d M y" />
                <button className="activate-button" onClick={this.toggleActUsers}>Activate Users</button> */}
                <table id="customers">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Active</th>
                    </tr>
                    {allUsers && allUsers.map((data, i) => {
                            return (
                                <tr>
                                     <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.phone}</td>
                                    <td>{data.email}</td>
                                    <td>{data.gender}</td>
                                    <td><Switch onChange={this.handleChange.bind(this,data.phone)} checked={data.active} /></td>
                                </tr>
                            )
                    }
                    )}
                    {/* <tr>
                        <td></td>
                        <td></td>
                        <td className="total-text">Total Hours</td>
                        <td></td>
                    </tr> */}
                </table>
            </div>
        )
    }
};

import React, {Component} from 'react';
import { getAllUsers, getAllReports } from './apiCalls';
import Switch from "react-switch";

export default class PendingReports extends Component {
    state = {
        allUsers: [],
        pendingReportUsers: [],
    }
    async componentDidMount(){
        this.props.toggleLoader(true);
        const allUsers = await getAllUsers();
        this.setState({allUsers});
        this.fetchAllUsers();
    }
    async fetchAllUsers(){
        let {allUsers} = this.state;
        const allReports = await getAllReports(this.props.startDate);
        this.props.toggleLoader(false);
        const getActiveAcc = allUsers && allUsers.filter((acc) => {
            if(acc.active){
                return acc;
            }
        });
        const pendingReportUsers = getActiveAcc && getActiveAcc.filter(function(cv){
            return !allReports.find(function(e){
                return e.phone == cv.phone;
            });
        });
        this.setState({pendingReportUsers});
    }

    render() {
        const { pendingReportUsers } = this.state;
        return(
            <div>
                <table id="customers">
                    <tr>
                        <th>S No</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Gender</th>
                    </tr>
                    {pendingReportUsers && pendingReportUsers.map((data, i) => {
                            return (
                                <tr>
                                     <td>{i+1}</td>
                                     <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.phone}</td>
                                    <td>{data.email}</td>
                                    <td>{data.gender}</td>
                                </tr>
                            )
                    }
                    )}
                </table>
            </div>
        )
    }
};

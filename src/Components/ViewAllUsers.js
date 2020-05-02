import React, {Component} from 'react';
import { getAllUsers, activateUser, updatePassword } from './apiCalls';
import Switch from "react-switch";
import { ToastsStore } from 'react-toasts';

export default class ViewAllUsers extends Component {
    state = {
        allUsers: [],
        toggleUpdatePassword: false,
        newPassword: '',
        userIndex: '',
    }
    componentDidMount(){
        this.fetchAllUsers();
    }
    async fetchAllUsers(){
        this.props.toggleLoader(true);
        const response = await getAllUsers();
        this.setState({allUsers:response});
        this.props.toggleLoader(false);
    }
    async handleChange(phone) {
        this.props.toggleLoader(true);
        await activateUser(phone);
        this.fetchAllUsers();
        this.props.toggleLoader(false);
    }
    async updatePassword(data) {
        const { newPassword } = this.state;
        if(newPassword.length < 8){
            ToastsStore.error('Password should be more then 8 characters');
        }else{
            this.props.toggleLoader(true);
            data.password = newPassword;
            await updatePassword(data);
            this.setState({toggleUpdatePassword: !this.state.toggleUpdatePassword, userIndex : ''});
            this.props.toggleLoader(false);
        }
    }
    toggleUpdatePassword(i) {
        this.setState({toggleUpdatePassword: !this.state.toggleUpdatePassword, userIndex : i});
    }
    onChangePassword = e => {
        this.setState({newPassword: e.target.value});
    }
    render() {
        const { allUsers, toggleUpdatePassword, userIndex } = this.state;
        return(
            <div>
                {/* <input type="date" value={startDate} onChange={data => this.handleChange(data)} dateformat="d M y" />
                <button className="activate-button" onClick={this.toggleActUsers}>Activate Users</button> */}
                <table id="customers">
                    <tr>
                        <th>S No</th>
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
                                     <td>{i+1}</td>
                                     <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.phone}</td>
                                    <td>{data.email}</td>
                                    <td>{data.gender}</td>
                                    <td style={{width: toggleUpdatePassword ? 400 : 200}}>
                                        <Switch onChange={this.handleChange.bind(this,data.phone)} checked={data.active} />
                                        <img className="update-password" src="./edit.svg" onClick={this.toggleUpdatePassword.bind(this, i)} />
                                        {toggleUpdatePassword && userIndex === i && <input style={{width:200}} type="text" value={this.state.newPassword} onChange={this.onChangePassword} />} 
                                        {toggleUpdatePassword && userIndex === i && <button className="update-button" onClick={this.updatePassword.bind(this,data)}>Update</button>}
                                    </td>
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

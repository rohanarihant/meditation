import React, { Component } from 'react';
import AuthContext from './AccountContext';
import { getAllReports, deleteReportApi, updateReportApi } from './apiCalls';
import EditReport from './editForm';
import ViewAllUsers from './ViewAllUsers';
import Loader from './loader';

const currentDate = new Date();

class Dashboard extends Component {
    state = {
        startDate: `${currentDate.getFullYear()}-${Number(currentDate.getMonth()) + 1 < 10 ? '0'+ Number(currentDate.getMonth() + 1) : Number(currentDate.getMonth() + 1)}-${currentDate.getDate()}`,
        totalDuration: 0,
        dataJson: [],
        editForm: false,
        editData: {},
        loading:false,
        actUsersScreen:false,
        screen:'Dashboard',
        selectedGender:'all'
    };
    static contextType = AuthContext;

    async componentDidMount(){
        this.getAllReport(this.state.startDate.split("-"));
    }

    handleChange = async (date) => {
        const formatDate = date.target.value.split("-");
        this.getAllReport(formatDate);
    };

    async getAllReport(formatDate){
        try{
            this.setState({loading:true});
            const response = await getAllReports();
            const filterDate = dat => {
                return dat.length > 1 ? dat[1] : dat;
            }
            this.setState({
                startDate: `${formatDate[0]}-${filterDate(formatDate[1])}-${filterDate(formatDate[2])}`,
                dataJson: response,
                loading:false,
            }, () => {
                this.calculateDuration();
            });
        } catch(e){
            this.setState({loading:false});
        }
    }
    calculateDuration = () => {
        let formatDuration = 0;
        let hours = 0;
        let minutes = 0;
        let minuteTotal = 0;
        this.state.dataJson && this.state.dataJson.map((data, i) => {
            if (this.state.startDate === data.data) {
                let splitDuration = data.duration.split(':');
                minuteTotal += Number(splitDuration[1]);
                minuteTotal += Number(splitDuration[0]) * 60;
            }
        })
        formatDuration = minuteTotal >= 60 ? Math.floor(minuteTotal / 60) : 0;
        minutes = minuteTotal % 60 || '00';
        const tempHRS = (formatDuration + hours);
        const finalHRS = tempHRS < 10 ? '0'+ tempHRS : tempHRS;
        const finalMNS = minutes < 10 ? '0'+ minutes : minutes;
        this.setState({ totalDuration: `${finalHRS}:${finalMNS}` })
    }
    logOut = () => {
        sessionStorage.clear();
        window.location.reload();
    }
    editReport = (data, e) => {
        let {screen, actUsersScreen} = this.state;
        screen = screen === 'EditScreen' ? "Dashboard" : "EditScreen";
        this.setState({
            editForm: !this.state.editForm,
            editData: data,
            screen
        });
    }
    updateEditData = (e) => {
        const { name, value } = e.target;
        let { editData } = this.state;
        editData[name] = value;
        this.setState({ editData });
    }
    deleteReport = async (id, e) => {
        try{
            this.setState({loading:true});
            await deleteReportApi(id);
            // window.location.reload();
            const response = await getAllReports();
            this.setState({
                dataJson: response
            }, () => {
                this.calculateDuration();
            });
            this.setState({loading:false});
        } catch(err){
            this.setState({loading:false});
        }
    }
    updateReport = async () => {
        try{
            this.setState({loading:true});
            const { editData } = this.state;
            await updateReportApi(editData.id, editData);
            setTimeout( async() => {
                const response = await getAllReports();
                this.setState({
                    dataJson: response,
                    editForm: false,
                }, () => {
                    this.calculateDuration();
                });
                this.setState({loading:false});
            },1000);
        } catch(err){
            this.setState({loading:false});
        }
    }
    toggleEditReport = () => {
        this.setState({editForm: false, screen: 'Dashboard'});
    }
    toggleActUsers = () => {
        let {screen, actUsersScreen} = this.state;
        screen = screen === 'ActivateUsers' ? "Dashboard" : "ActivateUsers";
        this.setState({actUsersScreen: !actUsersScreen, screen});
    }
    selectGender = (e) => {
        this.setState({selectedGender:e.target.value});
    }
    toggleLoader = e => {
        this.setState({loading: !this.state.loading});
    }
    renderData = (data) => {
        return (
            <tr>
                <td>{data.name}</td>
                <td>{data.phone}</td>
                <td>{data.data}</td>
                <td>{data.gender}</td>
                <td>{data.startTime}</td>
                <td>{data.endTime}</td>
                <td>{data.duration.substr(0,5)}</td>
                <td>
                    <img className="margin-right" src="./edit.svg" onClick={this.editReport.bind(this, data)} />
                    <img className="margin-left" src="./delete.svg" onClick={this.deleteReport.bind(this, data.id)} />
                </td>
            </tr>
        )
    }
    renderScreen(){
        let { startDate, totalDuration, dataJson, editForm, editData, loading, actUsersScreen, screen, selectedGender } = this.state
        switch(screen){
            case('ActivateUsers'):
            return ( <ViewAllUsers editData={editData} toggleLoader={this.toggleLoader} updateEditData={this.updateEditData} updateReport={this.updateReport} /> );
            case('EditScreen'):
            return ( <EditReport editData={editData} updateEditData={this.updateEditData} updateReport={this.updateReport} /> );
            default:
                return(       
                <div>
                    <input type="date" value={startDate} onChange={data => this.handleChange(data)} dateformat="d M y" />
                    <select className="gender-selection" onChange={data => this.selectGender(data)} >
                        <option>all</option>
                        <option>male</option>
                        <option>female</option>
                    </select>
                    <button className="activate-button" onClick={this.toggleActUsers}>Activate Users</button>
                    <table id="customers">
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Gender</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                        {dataJson && dataJson.map((data, i) => {
                            if (startDate === data.data) {
                                if(selectedGender === data.gender){
                                    return (
                                        <tr>
                                            <td>{data.name}</td>
                                            <td>{data.phone}</td>
                                            <td>{data.data}</td>
                                            <td>{data.gender}</td>
                                            <td>{data.startTime}</td>
                                            <td>{data.endTime}</td>
                                            <td>{data.duration.substr(0,5)}</td>
                                            <td>
                                                <img className="margin-right" src="./edit.svg" onClick={this.editReport.bind(this, data)} />
                                                <img className="margin-left" src="./delete.svg" onClick={this.deleteReport.bind(this, data.id)} />
                                            </td>
                                        </tr>
                                    )
                                }else if(selectedGender === 'all'){
                                    return (
                                        <tr>
                                            <td>{data.name}</td>
                                            <td>{data.phone}</td>
                                            <td>{data.data}</td>
                                            <td>{data.gender}</td>
                                            <td>{data.startTime}</td>
                                            <td>{data.endTime}</td>
                                            <td>{data.duration.substr(0,5)}</td>
                                            <td>
                                                <img className="margin-right" src="./edit.svg" onClick={this.editReport.bind(this, data)} />
                                                <img className="margin-left" src="./delete.svg" onClick={this.deleteReport.bind(this, data.id)} />
                                            </td>
                                        </tr>
                                    )
                                }
                            }
                        }
                        )}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="total-text">Total Hours</td>
                            <td className="total-text">{totalDuration}</td>
                            <td></td>
                        </tr>
                    </table>
                </div> )
    }
}
    render() {
        let { startDate, totalDuration, dataJson, editForm, editData, loading,screen, actUsersScreen } = this.state;
        return (
            <div>
                {loading && <Loader /> }
                <div class="topnav">
                    {screen !== 'Dashboard' && <img className="back-icon" src="./back.jpeg" onClick={this.toggleEditReport} />}
                    <p>{`Meditation Report :- ${startDate}`}</p>
                    <button onClick={this.logOut}>Logout</button>
                </div>
                    {this.renderScreen()}
            </div>
        )
    }
}
export default Dashboard;
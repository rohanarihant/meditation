import React, { Component } from 'react';
import AuthContext from './AccountContext';
import { getAllReports, deleteReportApi, updateReportApi } from './apiCalls';
import EditReport from './editForm';
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
    };
    static contextType = AuthContext;

    // async componentDidMount(){
    //     const response = await getAllReports();
    //     console.log(response,'response')
    //     this.setState({dataJson:response});
    // }

    handleChange = async (date) => {
        const formatDate = date.target.value.split("-");
        try{
            this.setState({loading:true});
            const response = await getAllReports();
            this.setState({
                startDate: `${formatDate[0]}-${formatDate[1][1]}-${formatDate[2]}`,
                dataJson: response,
                loading:false,
            }, () => {
                this.calculateDuration();
            });
        } catch(e){
            this.setState({loading:false});
        }
    };

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
        this.setState({
            editForm: !this.state.editForm,
            editData: data,
        });
    }
    updateEditData = (e) => {
        const { name, value } = e.target;
        let { editData } = this.state;
        editData[name] = value;
        this.setState({ editData });
    }
    deleteReport = async (id, e) => {
        await deleteReportApi(id);
        // window.location.reload();
        const response = await getAllReports();
        this.setState({
            dataJson: response
        }, () => {
            this.calculateDuration();
        });
    }
    updateReport = async () => {
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
        },1000);
    }
    toggleEditReport = () => {
        this.setState({editForm: false});
    }
    render() {
        let { startDate, totalDuration, dataJson, editForm, editData, loading } = this.state;
        return (
            <div>
                {loading && <Loader /> }
                <div class="topnav">
                    {editForm && <img className="back-icon" src="./back.jpeg" onClick={this.toggleEditReport} />}
                    <p>{`Meditation Report :- ${startDate}`}</p>
                    <button onClick={this.logOut}>Logout</button>
                </div>
                {editForm ? <EditReport editData={editData} updateEditData={this.updateEditData} updateReport={this.updateReport} />
                    :
                    <div>
                        <input type="date" value={startDate} onChange={data => this.handleChange(data)} dateformat="d M y" />
                        <table id="customers">
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Date</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                            {dataJson && dataJson.map((data, i) => {
                                if (startDate === data.data) {
                                    return (
                                        <tr>
                                            <td>{data.name}</td>
                                            <td>{data.phone}</td>
                                            <td>{data.data}</td>
                                            <td>{data.duration.substr(0,5)}</td>
                                            <td>
                                                <img className="margin-right" src="./edit.svg" onClick={this.editReport.bind(this, data)} />
                                                <img className="margin-left" src="./delete.svg" onClick={this.deleteReport.bind(this, data.id)} />
                                            </td>
                                        </tr>
                                    )
                                }
                            }
                            )}
                            <tr>
                                <td></td>
                                <td></td>
                                <td className="total-text">Total Hours</td>
                                <td className="total-text">{totalDuration}</td>
                                <td></td>
                            </tr>
                        </table>
                    </div>}
            </div>
        )
    }
}
export default Dashboard;
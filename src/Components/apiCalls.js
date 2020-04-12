import axios from 'axios';
import {ToastsStore} from 'react-toasts';

const ApiUrl = 'http://ec2-18-219-132-44.us-east-2.compute.amazonaws.com:8080';


const loginCredentials = {
        "phoneOrEmail": "RohitBangaloreMeditationApp@gmail.com",
        "password": "9988776655"
    }
    const options = {
        'content-type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('apiToken')}`
    }
export function getAllReports(){

    return axios({ method: 'GET', url: `${ApiUrl}/api/report`, headers: options })
    .then( async(res) => {
      const dataJson = await res.data.content;
      return dataJson;
    //   this.setState({ dataJson });
    }).catch(error => {
        // console.log(error,'error');
    });
}

export function loginApi(email, password){
    return axios.post(`${ApiUrl}/api/auth/signin`, { "phoneOrEmail": email, "password": password })
    .then(res => {
        sessionStorage.setItem('apiToken',res.data.accessToken);
        ToastsStore.success("Login Sucessfully")
    }).catch(error => {
        ToastsStore.error("error while login");
    })
}

export function deleteReportApi(id){
    return axios.delete(`${ApiUrl}/api/report/${id}`, {headers: options} )
    .then(res => {
        ToastsStore.success("Report Deleted Sucessfully")
    }).catch(error => {
        ToastsStore.error("error while deleting the Report")
    })
}

export function updateReportApi(id,editData){
    axios.put(`${ApiUrl}/api/report/${id}`, editData, {headers: options}, )
    .then(res => {
        ToastsStore.success("Report Updated Sucessfully")
        return res;
    }).catch(error => {
        ToastsStore.error("error while updating the Report")
    })
}


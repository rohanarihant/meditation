import axios from 'axios';
import {ToastsStore} from 'react-toasts';

const ApiUrl = 'https://bmeditation.herokuapp.com';
// const ApiUrl = 'http://localhost:8080';


const loginCredentials = {
        "phoneOrEmail": "9741930304",
        "password": "9988776655"
    }
    const options = {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '"Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"',
        'Authorization': `Bearer ${sessionStorage.getItem('apiToken')}`
    }
export function getAllReports(date){

    return axios({ method: 'GET', url: `${ApiUrl}/api/report/data/${date}`, headers: options })
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

export function updatePassword(data){
    axios.put(`${ApiUrl}/api/users/updatePassword/${data.phone}`, data, {headers: options}, )
    .then(res => {
        ToastsStore.success("Password Updated Sucessfully")
        return res;
    }).catch(error => {
        ToastsStore.error("error while updating the Password")
    })
}

export function getAllUsers(){

    return axios({ method: 'GET', url: `${ApiUrl}/api/users/allUsers`, headers: options })
    .then( async(res) => {
      const dataJson = await res.data.content;
      return dataJson;
    //   this.setState({ dataJson });
    }).catch(error => {
        // console.log(error,'error');
    });
}

export function activateUser(phone){

    return axios({ method: 'PUT', url: `${ApiUrl}/api/users/activate/${phone}`, headers: options })
    .then( async(res) => {
        // console.log('response');
    }).catch(error => {
        // console.log('error');
    });
}


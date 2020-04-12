import React, { Component} from 'react';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import {withAccount} from './Components/AccountContext';
import {loginApi} from './Components/apiCalls';
import {ToastsContainer, ToastsStore} from 'react-toasts';


class App extends Component {
  state = {
    login: false,
    email:'',
    password:'',
    errorMsg:'',
  }

  componentDidMount(){
    const accessToken = sessionStorage.getItem('apiToken');
    this.setState({accessToken:accessToken})
  }
  updateLogin = async() => {
    const {email, password} = this.state;
    if(email !== '' && password !== ''){
      await loginApi(email, password);
    }
    setTimeout(() => {
      window.location.reload();
    },1000);
    // this.setState({login: !this.state.login});
  }
  userLogin = async() => {
    const {email, password} = this.state;
    // const response = await loginApi();
    // this.setState({});

  }
  updateField = (e) => {
    const {name, value} = e.target;
    this.setState({[name]:value});
  }
  render(){
    let {email, password, errorMsg} = this.state;
    return (
      <div className="App">
        {sessionStorage.getItem('apiToken') !== null ? <Dashboard />
        // {true ? <Dashboard />
        : 
        <Login userLogin={this.updateLogin} email={email} password={password} errorMsg={errorMsg} updateField={this.updateField} />}
        <ToastsContainer store={ToastsStore}/>
      </div>
    );
  }
}

export default withAccount(App);

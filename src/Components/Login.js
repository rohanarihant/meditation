import React from 'react';

const Login = (props) => [
    <div className="header" ></div>,
    <div class="wrap">
        <form class="login-form" action="">
            <div class="form-header">
                <h3>Meditation App Dashboard</h3>
                <p>Login to access your Dashboard</p>
            </div>
            <div class="form-group">
                <input type="text" class="form-input" name="email" onChange={props.updateField} placeholder="email@example.com" />
            </div>
            <div class="form-group">
                <input type="password" class="form-input" name="password" onChange={props.updateField} placeholder="password" />
            </div>
            <div class="form-group">
                <button class="form-button" type="button" onClick={() => {props.userLogin()}}>Login</button>
            </div>
            {props.errorMsg && <p style={{color:'black'}}>{props.errorMsg}</p>}
        </form>
</div>];

export default Login;
import {useState, React } from "react";
import {Navigate} from "react-router-dom";

const Login = () => {

    const LoginErr = () => {
        const err = sessionStorage.getItem('error_on_login')
        if(err == 1){
            return <h4 >Check your credentials ( ͡° ͜ʖ ͡°) </h4>
        }
        return null
    }

    const [LoginInfo, setLoginInfo] = useState({
        name:"",
        password:""
    });
    
    
    if(sessionStorage.getItem('auth') != 'true')
        sessionStorage.setItem('auth','false');
    else{
        //alert("Already Logged In");
        return <Navigate to = "/home"/>
    }
    
    const requestOptions = {
        method: 'POST',
        //mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'    
        },
        credentials : "include",
        body: new URLSearchParams({
            'username': LoginInfo.name,
            'password': LoginInfo.password
        })
    };
    
    const handleLogin = () => {
        fetch("https://localhost:9103/interoperability/api/login",requestOptions)
        .then(data => {
            if(!data.ok){
                const err = new Error("Incorrect Credentials");
                err.data = data;
                throw err;
            } 
            sessionStorage.removeItem('error_on_login');
            sessionStorage.setItem('auth','true');
            sessionStorage.setItem('username',LoginInfo.name);
            return data.json();
        })
        .then((data)=>{
                sessionStorage.setItem('level', data.token[data.token.length - 1]);            
            return
        })
        .catch((err)=>{
            sessionStorage.setItem('error_on_login', '1');
        })
    }
    
    const handleChangename = (event) => {
        setLoginInfo({
            name: event.target.value,
            password: LoginInfo.password
        })
    }

    const handleChangepass = (event) => {
        setLoginInfo({
            name: LoginInfo.name,
            password: event.target.value,
        })
    }

    return (
            <div className="center">
            <LoginErr/>
            <form onSubmit={handleLogin}>
                <input placeholder="Username" type = "text" name = "name" className="rounded-input" onChange={handleChangename}/>
                <input placeholder="Password" type = "password" name = "password" className="rounded-input" onChange={handleChangepass}/><br/>
                <button type = "submit" className="button button2">submit</button>
            </form>
            </div>
    )
}

export default Login
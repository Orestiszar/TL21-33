import {React} from "react"
import { Navigate , useNavigate} from "react-router-dom";


const Logout = ()=>{
    let history = useNavigate();
    const auth = sessionStorage.getItem('auth');
    if(auth != 'true'){
        return <Navigate to = "/login"/>
    }
    
    const requestOptions = {
        method: 'POST',
        //mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'    
        },
        credentials : "include"
    };

    const handleLogout = ()=>{
        fetch("https://localhost:9103/interoperability/api/logout",requestOptions)
        .then(()=>{ 
        sessionStorage.clear();
        sessionStorage.setItem('auth','false');
        history("/login")
        })
    }

    return (
        
        <>
        <div className="center">
        <h1>Confirm Logout?</h1><br/>
        <form  onSubmit={handleLogout}>
            <button type = "submit" className="button button2">Yes, logout</button>
        </form>
        <form  onSubmit={()=>{history("/home")}}>
            <button type = "submit" className="button buttoncans">Cancel</button>
        </form>
        </div>
        </>
    )
}

export default Logout
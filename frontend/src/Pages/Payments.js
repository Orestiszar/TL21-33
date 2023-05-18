import { React, useState } from "react";
import Select from "react-select";
import { Navigate } from "react-router-dom";

const Payments =()=>{
    
    const [Balance,setBalance] = useState('0');
    const [Operator,setOperator] = useState('');
    const [Cred,setCred] = useState('');
    const [paymentdata, setPaymentdata] = useState({
        Payer : '',
        Receiver : '',
        Amount : '',
        DateOfPayment : '',
        PaymentStatus : ''
    })
    
    if(sessionStorage.getItem('auth') != 'true' || sessionStorage.getItem('level') == '3' )
        return <Navigate to = "/home"/>
    
    const DispStatus = () => {

        if(sessionStorage.getItem('level') == '2' ) return (
            <h1>Admin cannot make payments! (ง •̀_•́)ง </h1>
        )
        
        if(!(paymentdata.Payer == '') && !(paymentdata.PaymentStatus.includes("Successful"))){
            return <h3 >Check payment credentials</h3>
        }
        return null
    }
    
    const DispData = () => {   
        
        if(paymentdata.Payer == '') return null
        return(
            <>
            <h2>Payment Informations</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Payer</th>
                        <th>Receiver</th>
                        <th>Amount</th>
                        <th>DateOfPayment</th>
                        <th>PaymentStatus</th>
                    </tr>
                    <tr>
                        <td>{paymentdata.Payer}</td>
                        <td>{paymentdata.Receiver}</td>
                        <td>{paymentdata.Amount}</td>
                        <td>{paymentdata.DateOfPayment}</td>
                        <td>{paymentdata.PaymentStatus}</td>
                    </tr>
                </tbody>
            </table>                
            </>
        )
    }


    const user = sessionStorage.getItem('username')
    const providers = ['AO','GF' ,'EG', 'KO', 'MR', 'NE','OO']
    
    function DropdownProviders(){
        var rows = [];
        for(var i=0; i<providers.length; i++){
            if(providers[i] != user) {
                rows.push({value : providers[i], label:providers[i]})
            }
        }
        return rows
    } 

    const requestOptions = {
        method: 'POST',
        //mode: 'cors',
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'    
        // },
        credentials : "include",
    };

    const HandlePayments = () =>{

        if(sessionStorage.getItem('level') == '2' ) return null

        fetch(`https://localhost:9103/interoperability/api/Deposit/${user}/${Operator.value}/${Balance}/${Cred}`,requestOptions)
        .then(data => { 
            return data.json();
            // alert(`${Operator.value} ${Balance}`)
        })
        .then(data => {
            setPaymentdata({
                Payer : data.Payer,
                Receiver : data.Receiver,
                Amount : parseFloat(data.Amount).toFixed(3),
                DateOfPayment : data.DateOfPayment,
                PaymentStatus : data.PaymentStatus
            })
            
        })
    }
    
    const handleOperators = (event)=>{
        setOperator(event);
    }
    const handleAmountChange = (event)=>{
        setBalance(event.target.value);
    }
    
    const handleCredChange = (event)=>{
        setCred(event.target.value);
    }
    
    const selected_opr = DropdownProviders();
    
    return (
        <>
        <div className="center2">
        <   DispStatus/>
        </div>
        <div className="center">
            <Select options={selected_opr} onChange={handleOperators} value={Operator}/>
            <label>Choose Operator to Pay:</label>
            <input type = "number" name = "amount" min="0" placeholder="amount" onChange={handleAmountChange}/><br/>
            <input type ="text" className = "rounded-input" name ="cred" placeholder= "Credential" onChange={handleCredChange}/>
            <button type = "submit" className="button button2" onClick={HandlePayments}>submit</button>
        </div>
        
        <DispData/>        
        </>
    )
}


export default Payments
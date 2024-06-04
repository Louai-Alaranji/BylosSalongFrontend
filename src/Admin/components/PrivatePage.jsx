import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from "../../User/Login.module.css"

export default function PrivatePage(){
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const email = useRef(null)
    const password = useRef(null)
    const [loginState, setLoginState] = useState({
        loading: false,
        error: null,
    });
    const handleCodeChange = (e) => {
      setCode(e.target.value);
    };


  

    //loggin in function, uses localStorage to store token recieved from backend. 
    function postLoginData(loginDetails) {
        setLoginState({ loading: true, error: null });
    
        fetch("https://localhost:7087/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginDetails)
        }).then(response => {
            if (!response.ok) {
                
                throw new Error("login failed!")
            }
            // Log response here
            
            return response.json();
        }).then(data => {
            
            const token = data.token;
            const employeeId = data.employeeId;
            if (token) {
                setLoginState({ loading: false, error: null });
                localStorage.setItem('token', token); 
                localStorage.setItem("employeeId", employeeId)
                if(code === '123'){
                    navigate("/Register")
                }else {
                    // Redirect to another page (e.g., login page) if the code is incorrect
                    alert("code entered is not correct")
                  }
                
            } else {
                // Handle the case where the token is missing in the response
                console.error("Token not found in response");
                setLoginState({ loading: false, error: "Token not found in response" });
            }
        }).catch(error => {
            setLoginState({ loading: false, error: error.message });
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const emailValue = email.current.value;
        const passwordValue = password.current.value;
        // Call the fetch request with login details
        const loginDetails = { email: emailValue, password: passwordValue };
        postLoginData(loginDetails);
    };


    return (
        <>
            
            <header className={classes.header}>
                <h1>Registrera</h1> 
            </header>
            
            <div className={classes.main}>
                
                <form className={classes.form} onSubmit={handleSubmit}>
                    <span className={classes.span}>
                        <label> Code </label>
                        <input type="text" value={code} onChange={handleCodeChange} />
                    </span>
                    <span className={classes.span}>
                        <label> Email </label>
                        <input type="email" ref={email} />
                    </span>
                    <span className={classes.span}>
                        <label > Password </label>
                        <input type="password" ref={password} />
                    </span>
                    {loginState.loading ? <button className={classes.button} disabled> Loading </button> : 
                    <button className={classes.button}>Login</button>}

                    {loginState.error && <p className="error">{loginState.error}</p>}
                </form>
                
               
            </div>
           
        </>

    )

}
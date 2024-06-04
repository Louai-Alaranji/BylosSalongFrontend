import { useEffect, useRef, useState } from "react"
import classes from "./Login.module.css"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { getAllEmployees } from "../util/getAllEmployees";
export default function Login() {
    const navigate = useNavigate();
    const email = useRef(null)
    const password = useRef(null)
    const [loginState, setLoginState] = useState({
        loading: false,
        error: null,
    });

    
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
                navigate('/AdminPage');
                
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
        const emailValue = email.current.value.trim(); // Trimmed email value
        const passwordValue = password.current.value.trim(); // Trimmed password value
    
    // Check if email or password are empty
        if (!emailValue || !passwordValue) {
            setLoginState({ loading: false, error: "Email and password are required" });
            return; // Exit early if email or password are empty
        }

        // Call the fetch request with login details
        const loginDetails = { email: emailValue, password: passwordValue };
        postLoginData(loginDetails);
    };


    return (
        <>
            <header className={classes.header}>
                <h1>Login</h1> 
                <Link className={classes.registerLink} to="/PrivatePage"> Registrera </Link>
            </header>
            
            <div className={classes.main}>
                
                <form className={classes.form} onSubmit={handleSubmit}>
                    <span className={classes.span}>
                        <label> Email </label>
                        <input type="email" ref={email} />
                    </span>
                    <span className={classes.span}>
                        <label > Lösenord </label>
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


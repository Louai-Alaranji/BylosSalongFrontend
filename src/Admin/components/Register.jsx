import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from '../../User/Login.module.css';
import { getAuthToken } from '../../util/getAuthToken.js';
import { Link } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  const job = useRef(null);
  const phone = useRef(null);
  const profilePicture = useRef(null);

  const [registerState, setRegisterState] = useState({
    loading: false,
    error: null,
  });

  const handleRegister = async (event) => {
    event.preventDefault();


    const formData = new FormData();
    formData.append('name', name.current.value);
    formData.append('email', email.current.value);
    formData.append('job', job.current.value);
    formData.append('phone', phone.current.value);
    formData.append('password', password.current.value);

    // Append the image file
    if (profilePicture.current.files[0]) {
      formData.append('imageFile', profilePicture.current.files[0]);
    }
    
    try {
      setRegisterState({ loading: true, error: null });
      const token = getAuthToken();
      const response = await fetch('https://localhost:7087/api/Auth/register', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) {
        console.log("FAILED, formData are", formData)
        throw new Error('Registration failed');
      }
      name.current.value = '';
      email.current.value = '';
      job.current.value = '';
      phone.current.value = '';
      password.current.value = '';
      profilePicture.current.value = '';
      
      alert("User registered successfully!");
      setRegisterState({ loading: false, error: null });
      navigate(''); // Redirect to login page after successful registration
    } catch (error) {
      setRegisterState({ loading: false, error: error.message });
    }
  };
  


  return (
    <>
      <header className={classes.header}>
        <h1>Registrera</h1>
        <Link to="/AllEmployees"> Alla Anställda</Link>
      </header>

      <div className={classes.main}>
        <form className={classes.form} onSubmit={handleRegister}>
          <span className={classes.span}>
            <label>Profil bild</label>
            <input className={classes.imgInput} type="file" ref={profilePicture} accept="image/*" required/>
          </span>
          <span className={classes.span}>
            <label>Namn</label>
            <input type="text" ref={name} required />
          </span>
          <span className={classes.span}>
            <label>Email</label>
            <input type="email" ref={email} required />
          </span>
          <span className={classes.span}>
            <label>Jobb</label>
            <input type="text" ref={job} required/>
          </span>
          <span className={classes.span}>
            <label>Mobil</label>
            <input type="text" ref={phone} required/>
          </span>
          <span className={classes.span}>
            <label>Lösenord</label>
            <input type="password" ref={password} required />
          </span>
          <div className={classes.divider}></div>

          

          {registerState.loading ? (
            <button className={classes.button} disabled>
              Loading
            </button>
          ) : (
            <button className={classes.button}>Register</button>
          )}
          {registerState.error && <p className="error">{registerState.error}</p>}
        </form>
      </div>
    </>
  );
};

export default Register;

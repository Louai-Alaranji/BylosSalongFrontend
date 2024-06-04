import { useState, useContext, useRef, useEffect } from "react";
import Modal from "./Modal.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import classes from "../User/Login.module.css";
import UserDataContext from "../store/UserDataContext.jsx";
import { getEmployeesServices } from "../util/getEmployeeServices.js";

export default function Form() {
    const [loginState, setLoginState] = useState({
        loading: false,
        error: null,
        verificationRequired: false,
    });

    const email = useRef(null);
    const name = useRef(null);
    const phone = useRef(null);
    const verificationCode = useRef(null);
    const userProgressctx = useContext(UserProgressContext);
    const userDataCtx = useContext(UserDataContext);
    const [services, setServices] = useState([]);
    const [bookingObj, setBookingObj] = useState(null);

    useEffect(() => {
        const Services = async () => {
            const services = await getEmployeesServices(userDataCtx.employeeId);
            setServices(services);
        };

        Services();
    }, [userDataCtx.employeeId]);

    function handleSubmit(event) {
        event.preventDefault();

        const bookingObject = {
            employeeId: userDataCtx.employeeId,
            date: userDataCtx.selectedDate,
            startTime: userDataCtx.selectedHour.startTime,
            serviceId: userDataCtx.selectedHour.serviceId,
            name: name.current.value,
            email: email.current.value,
            phone: phone.current.value,
        };
        setBookingObj(bookingObject);
        setLoginState((oldState) => ({ ...oldState, loading: true, error: null }));

        fetch('https://localhost:7087/api/User/appointments/send-verification-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingObject),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const data = await response.text();
                    throw new Error(data);
                }
                setLoginState((oldState) => ({ ...oldState, loading: false, verificationRequired: true }));
            })
            .catch((error) => {
                setLoginState((oldState) => ({ ...oldState, loading: false, error: error.message }));
                console.error('Error sending verification code:', error.message);
            });
    }

    function handleVerification() {
        setLoginState((oldState) => ({ ...oldState, loading: true, error: null }));
        const stringcode = verificationCode.current.value.toString();
        const code = stringcode.trim();
        console.log(code)
        console.log(bookingObj.email)
        fetch('https://localhost:7087/api/User/appointments/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: bookingObj.email,
                code: code,
            }),
        })
            .then(async (response) => {
                
                if (!response.ok) {
                    const data = await response.text();
                    throw new Error(data);
                }
                bookAppointment(bookingObj);
            })
            .catch((error) => {
                setLoginState((oldState) => ({ ...oldState, loading: false, error: error.message }));
                console.error('Error verifying code:', error.message);
            });
    }

    function bookAppointment(bookingObject) {
        fetch('https://localhost:7087/api/User/appointments/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingObject),
        })
            .then(async (response) => {
                const data = await response.text();
                if (!response.ok) {
                    throw new Error(data);
                }
                setLoginState({
                    loading: false,
                    error: null,
                    verificationRequired: false,
                });
                userProgressctx.showSuccess();
                name.current.value = '';
                email.current.value = '';
                phone.current.value = '';
                verificationCode.current.value = '';
            })
            .catch((error) => {
                setLoginState((oldState) => ({ ...oldState, loading: false, error: error.message }));
                console.error('Error booking appointment:', error.message);
            });
    }

    function handleClose() {
        userProgressctx.hideModal();
    }

    return (
        <>
            <Modal open={userProgressctx.progress === "modal"}>
                {!loginState.verificationRequired ? (
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <span className={classes.span}>
                            <label> Namn </label>
                            <input type="text" ref={name} required />
                        </span>
                        <span className={classes.span}>
                            <label> Email </label>
                            <input type="email" ref={email} required />
                        </span>
                        <span className={classes.span}>
                            <label> Mobil </label>
                            <input type="tel" ref={phone} required />
                        </span>
                        {loginState.loading ? (
                            <button className={classes.button} disabled>Loading...</button>
                        ) : (
                            <button className={classes.button}>Boka Tid</button>
                        )}
                        {loginState.error && (
                            <p className={classes.error}>{loginState.error}</p>
                        )}
                        {loginState.loading ? <button className={classes.button} disabled>Loading...</button> : <button type="button" className={classes.button} onClick={handleClose}>
                            Stäng
                        </button> }
                    </form>
                ) : (
                    <div className={classes.form}>
                        <span className={classes.span}>
                            <label > Verifierings kod </label>
                            <input type="text" ref={verificationCode} required />
                        </span>
                        {!loginState.loading &&  (
                            <div className={classes.verifyDiv}>
                                <button type="button" onClick={handleVerification} className={`${classes.button} ${classes.verifyButton}`}>
                                    Verifiera
                                </button>
                            </div>

                        )}
                        {loginState.loading &&
                        <button className={`${classes.button} 
                        ${classes.centeredButton}`} disabled>Loading...</button> 
                        }
                        {loginState.error && (
                            <p className={classes.error}>{loginState.error}</p>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
}

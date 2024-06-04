// SetServices.jsx
import { useEffect, useRef, useState } from "react";
import { getAuthToken, getEmployeeId } from "../../util/getAuthToken";
import { useNavigate } from "react-router-dom";
import classes from "./SetServices.module.css";

export default function SetServices() {
    const [services, setServices] = useState([]);
    const serviceName = useRef();
    const serviceDuration = useRef();
    const [loading, setLoading ] = useState(false)
    const navigate = useNavigate();

    const handleSendServices = async () => {
        setLoading(true)
        const employeeId = getEmployeeId();
        const token = getAuthToken();
        const servicesWithEmployeeId = services.map((service) => ({
            ...service,
            employeeId: employeeId,
        }));

        const response = await fetch(
            `https://localhost:7087/api/Admin/setEmployeesServices/${employeeId}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
                body: JSON.stringify(servicesWithEmployeeId),
            }
        );
        if (!response.ok) {
            setLoading(false)
            alert("there was an error saving services")
            throw new Error("send services failed!");
        }
        setLoading(false)
        alert("successfully saved services");
        navigate("/AdminPage")
    };

    function handleServiceAdd() {
        const nameOfService = serviceName.current.value;
        const durationOfService = serviceDuration.current.value;
        if (nameOfService && durationOfService) {
            // Add the service to the services array
            setServices((prevServices) => [
                ...prevServices,
                { name: nameOfService, durationInMinutes: durationOfService },
            ]);
    
            // Clear input fields after adding service
            serviceName.current.value = "";
            serviceDuration.current.value = "";
        } else {
            alert("Service name and duration are required.")
        }
    }

    return (
        <div className={classes.mainContainer}>
            <div className={classes.container}>
            <div className={classes.formGroup}>
                <label htmlFor="service-input" className={classes.label}>
                    Service Namn:
                </label>
                <input
                    type="text"
                    id="service-input"
                    ref={serviceName}
                    className={classes.input}
                />
            </div>
            <div className={classes.formGroup}>
                <label htmlFor="service-duration" className={classes.label}>
                    Servicevaraktighet (minuter):
                </label>
                <input
                    type="number"
                    id="service-duration"
                    min="1"
                    ref={serviceDuration}
                    className={classes.input}
                />
            </div>
            <div className={classes.buttonContainer}>
            {loading ? <button className={classes.button} disabled> Loading... </button> : 
            <button
                type="button"
                onClick={handleServiceAdd}
                className={classes.addButton}>
                    Lägg till
                </button> }
                
            </div>
            <ul className={classes.serviceList}>
                {services.map((service, index) => (
                    <li key={index} className={classes.serviceItem}>
                        {service.name} - {service.durationInMinutes} minuter
                    </li>
                ))}
            </ul>
        </div>
        {loading ? <button className={classes.button} disabled> Loading... </button> : 
            <button
                type="button"
                onClick={handleSendServices}
                className={classes.addButton}>
                    Spara Service
                </button> }
        </div>
        
        
    );
}

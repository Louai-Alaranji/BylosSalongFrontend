import {useLoaderData} from "react-router-dom"
import { getAvailableHours } from "../util/getAvailableHours.js";
import { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar"
import classes from "../Admin/components/AdminPage.module.css"
import UserProgressContext from "../store/UserProgressContext.jsx";
import UserDataContext from "../store/UserDataContext.jsx";
import { getEmployeesServices } from "../util/getEmployeeServices.js";



export default function UserBooking(){
    const allEmployees = useLoaderData() ||[]
    const [availableHours, setAvailablehours] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())  
    const userDataCtx = useContext(UserDataContext)
    const userProgressCtx = useContext(UserProgressContext)
    const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [fetchedServices, setFetchedServices] = useState([])
    const [selectedService, setSelectedService] = useState()

    const [filteredAvailableHours, setFilteredAvailableHours] = useState([])
    // get hours for the clicked employee


    function handleDateChange(date){
        
        const timezoneOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
        const adjustedDate = new Date(date - timezoneOffset);
        setSelectedDate(adjustedDate)
        userDataCtx.handleDate(adjustedDate)
       
    }

    function handleSelectHour(hour){
        userDataCtx.handleHour(hour)
        userProgressCtx.showModal();
    }

    const handleEmployeeSelect = async (employeeId) => {
        try {
          // Convert the selected employee ID to a number
          const parsedEmployeeId = parseInt(employeeId, 10); // or +employeeId;
            
          const services = await getEmployeesServices(parsedEmployeeId)
          
          const hours = await getAvailableHours(parsedEmployeeId);
          hours.sort((a, b) => {
            // Convert startTime strings to Date objects for comparison
            const dateA = new Date(`2000-01-01T${a.startTime}`);
            const dateB = new Date(`2000-01-01T${b.startTime}`);
            return dateA - dateB; // Sort by ascending order
          });
          setAvailablehours(hours);
          setFetchedServices(services);

          userDataCtx.handleEmployeeId(parsedEmployeeId);
          const selectedEmployee = allEmployees.find(
            (employee) => employee.id === parsedEmployeeId
          );
          setSelectedEmployee(selectedEmployee);
        } catch (error) {
          console.error("Error fetching available hours:", error);
        }
    };

    // takes care of the gap on lunch
    useEffect(() => {
        const selectedServiceObject = fetchedServices.find(service => service.id === parseInt(selectedService));
        if (selectedServiceObject) {
            const slotsRequired = Math.ceil(selectedServiceObject.durationInMinutes / 15);
    
            let filteredHours = availableHours.filter((hourObject) => {
                const hourDate = new Date(hourObject.date);
                const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                return ((hourDate.getTime() === selectedDateOnly.getTime()) && (parseInt(hourObject.serviceId) === parseInt(selectedService)));
            }).map(hour => ({ ...hour, isGap: false }));
            
            for (let i = 0; i < filteredHours.length - 1; i++) {
                const currentHour = new Date(`2000-01-01T${filteredHours[i].startTime}`);
                const nextHour = new Date(`2000-01-01T${filteredHours[i + 1].startTime}`);
                const diffMinutes = (nextHour - currentHour) / (1000 * 60); // Calculate difference in minutes
    
                if (diffMinutes > 15) {
                    const gapIndex = i - slotsRequired +2;
                    for (let j = i; j >= gapIndex; j--) {
                        filteredHours[j] = { ...filteredHours[j], isGap: true };
                    }
                }
            }
            
            setFilteredAvailableHours(filteredHours);
        }
    }, [availableHours, selectedDate, selectedService]);
    
    
      

    return (
        <div className={classes.adminMainDiv}>
            <h1 >Välj anställd</h1>

            <select 
            className={classes.employeeSelect}
            onChange={(event) => handleEmployeeSelect(event.target.value)} >
                <option value="">Välj anställd</option>
                {allEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.job}
                </option>
                ))}

            </select>

            {selectedEmployee && (
                <>
                <h1 className={classes.title}>
                    {selectedEmployee.name}'s calendar
                </h1>
                <div className={classes.profileInfo}>
                    <img
                    className={classes.profilePic}
                    src={`https://localhost:7087/images/${selectedEmployee.imageName}`}
                    alt={selectedEmployee.name}
                    />
                    <div className={classes.employeeInfo}>
                    <span className={classes.employeeJob}>{selectedEmployee.job}</span>
                    </div>
                    <select 
                    className={classes.adminServicesDropddown} 
                    value={selectedService} 
                    onChange={(event) => setSelectedService(event.target.value)}
                    disabled={!selectedDate}>
                        <option value="">Välj tjänst</option>
                        {fetchedServices.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name} - {service.durationInMinutes} minutes
                            </option>
                        ))}
                    </select>
                </div>
                </>
            )}

                
            {selectedEmployeeName ? <h1 className={classes.title}>{selectedEmployeeName}'s Kalender</h1> : ""}

            <Calendar className={classes.calendar}
            onChange={handleDateChange}
            minDate={new Date()}
            value={selectedDate}/>
            <p className={classes.selectedDate}>Vald datum: {selectedDate.toDateString()}</p>
            <ul className={classes.list}>
                <div className={classes.mainDiv}>
                {
                    
                    filteredAvailableHours.map((hourObject, index) => {
                        
                        const selectedServiceObject = fetchedServices.find(service => service.id === parseInt(selectedService));
                        const slotsRequired = Math.ceil(selectedServiceObject.durationInMinutes / 15);
                        const availableIndex = filteredAvailableHours.findIndex(hour => hourObject.startTime === hour.startTime && hour.isAvailable);
                        let isDisabled = false;

                        const nextHour = filteredAvailableHours[index + 1];
                        
                       
                        if (availableIndex !== -1 ) {
                            let consecutiveSlots = 1;
                            let currentIndex = availableIndex;
                            
                            
                            while (consecutiveSlots < slotsRequired && currentIndex + 1 < filteredAvailableHours.length) {
                                if (filteredAvailableHours[currentIndex + 1].isAvailable) {
                                    consecutiveSlots++;
                                } else {
                                    break;
                                }
                                currentIndex++;
                            }
            
                            isDisabled = consecutiveSlots !== slotsRequired || filteredAvailableHours.slice(index + 1, index + slotsRequired).some(slot => !slot.isAvailable);
                        } else {
                            isDisabled = true; // If the current hour is not available, disable the button
                        }
                    
 

                    return(
                            <>
                            <button disabled={!hourObject.isAvailable || isDisabled || hourObject.isGap}
                             onClick={() => handleSelectHour(hourObject)} 
                             className={`${classes.button} ${isDisabled ? classes.disabledButton : ''} ${hourObject.isGap ? classes.disabledButton : ''} `}
                             key={index}> {hourObject.startTime.substring(0, 5)} </button>
                            </>
                    )
                    }
                        
                    )
                }
                </div>
                
            </ul>
        
        
        </div>
            
        
    )
}

export async function loader(){
    try{
        const response = await fetch(`https://localhost:7087/api/User/GetAllEmployees`);
        if (!response.ok) {
            throw new Error("Failed to fetch employees");
        }

        const employeesList = await response.json();
        
        // Ensure the employeesList is an array
        if (!Array.isArray(employeesList)) {
            return [];
        }
        
        return employeesList;
    } catch (error) {
        console.error("Error fetching employees:", error);
        return []; // Return an empty array in case of error
    }
}

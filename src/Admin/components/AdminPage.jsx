import classes from "./AdminPage.module.css";
import { getAuthToken, getEmployeeId } from "../../util/getAuthToken.js";
import Calendar from "react-calendar";
import { useLoaderData } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getAvailableHours } from "../../util/getAvailableHours.js";
import { useNavigate } from "react-router-dom";
import { getEmployeesServices } from "../../util/getEmployeeServices.js";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const employeeName = data.name;
  const employeeId = data.id;
  const employeePic = data.imageName;

  const startWorkRef = useRef();
  const lunchBreakStartRef = useRef();
  const lunchBreakEndRef = useRef();
  const endWorkRef = useRef();

  const [selectedServiceId, setSelectedServiceId] = useState("")

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [fetchedServices, setFetchedServices] = useState([])
  const [fetchedHours, setFetchedHours] = useState([]);

  //fetch employee hours 
  useEffect(()=>{
    const fetchAvailableHours = async () => {
      try {
        const hours = await getAvailableHours(employeeId);
        setFetchedHours(hours);
       
      } catch (error) {
        console.error("Error fetching employee services:", error);
      }
    };
  
    fetchAvailableHours();
  }, [])
  // Set default values for the time inputs when the component mounts
  useEffect(() => {
    if (startWorkRef.current) startWorkRef.current.value = "00:00:00";
    if (lunchBreakStartRef.current) lunchBreakStartRef.current.value = "00:00:00";
    if (lunchBreakEndRef.current) lunchBreakEndRef.current.value = "00:00:00";
    if (endWorkRef.current) endWorkRef.current.value = "00:00:00";
  }, []);

  // fetch employees services form backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await getEmployeesServices(employeeId);
        setFetchedServices(services);
      } catch (error) {
        console.error("Error fetching employee services:", error);
      }
    };
  
    fetchData();
  }, [employeeId]);

 
const saveSelectedHours = async () => {
  // Extract time values from input fields
  let startWorkValue = startWorkRef.current.value;
  let lunchBreakStartValue = lunchBreakStartRef.current.value;
  let lunchBreakEndValue = lunchBreakEndRef.current.value;
  let endWorkValue = endWorkRef.current.value;

  if (startWorkValue.length === 5) startWorkValue += ":00";
  if (lunchBreakStartValue.length === 5) lunchBreakStartValue += ":00";
  if (lunchBreakEndValue.length === 5) lunchBreakEndValue += ":00";
  if (endWorkValue.length === 5) endWorkValue += ":00";


  // Construct workingHours object with time values formatted as strings
  const workingHours = {
      startTime: startWorkValue, // Start time as string "HH:mm:ss"
      lunchBreakStart: lunchBreakStartValue, // Lunch break start as string "HH:mm:ss"
      lunchBreakEnd: lunchBreakEndValue, // Lunch break end as string "HH:mm:ss"
      endTime: endWorkValue, // End time as string "HH:mm:ss"
  };

  // Construct SetAvailableHoursRequest object with workingHours and selectedService
  const requestData = {
    workingHours,
    serviceId: selectedServiceId, // Include selected service ID
    date: selectedDate.toISOString().split('T')[0]
  };

  try {
    const token = getAuthToken();
    const response = await fetch(`https://localhost:7087/api/Admin/employees/${employeeId}/setAvailablehours`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Failed to save working hours.');
    }

    const updatedHours = await getAvailableHours(employeeId);
    updatedHours.sort((a, b) => {
      // Convert startTime strings to Date objects for comparison
      const dateA = new Date(`2000-01-01T${a.startTime}`);
      const dateB = new Date(`2000-01-01T${b.startTime}`);
      return dateA - dateB; // Sort by ascending order
    });
    
    setFetchedHours(updatedHours);

  } catch (error) {
    console.error('Error saving working hours:', error);

  }
};

  // Function to handle calendar date change
  const handleDateChange = (date) => {
    const timezoneOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const adjustedDate = new Date(date - timezoneOffset);
    setSelectedDate(adjustedDate)
    
  };

  const handleHourDelete = async (hourObject) => {
    const token = getAuthToken();

    const response = await fetch("https://localhost:7087/api/Admin/DeleteSelectedHour", {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(hourObject)
    })
    if(!response.ok){
      throw new Error("Failed to delete")
    } 
    const newHours =  await getAvailableHours(employeeId)
    setFetchedHours(newHours)
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    navigate("/");
  }

  const handleServiceChange = (event) => {
    setSelectedServiceId(event.target.value);
  };

  return (
    <>
    <div className={classes.adminMainDiv}>
      <h1 className={classes.title}>{employeeName}'s sida</h1>
      {employeePic && <img src={`https://localhost:7087/images/${employeePic}`} className={classes.profilePic} />}
      <h2>Tjänster:</h2>
      <select value={selectedServiceId} onChange={handleServiceChange} className={classes.adminServicesDropddown} >
        <option value="">Välj tjänst</option>
        {fetchedServices.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name} - {service.durationInMinutes} minuter
          </option>
        ))}
      </select>

      <Calendar className={classes.calendar} onChange={handleDateChange} minDate={tomorrow} value={selectedDate} />

      <p className={classes.selectedDate}>Vald datum: <strong> {selectedDate.toDateString()} </strong> </p>
      <div className={classes.span}>
        <span className={classes.hoursSpan}>
          <label>Starta Arbete:</label>
          <input type="time" className={classes.hourInput} ref={startWorkRef} step="1" required />
        </span>
        

        <span className={classes.hoursSpan}>
        <label>Starta Lunch:</label>
        <input type="time" className={classes.hourInput} ref={lunchBreakStartRef} step="1"  required/>
        </span>
        
        <span className={classes.hoursSpan}>
        <label>Sluta Lunch:</label>
        <input type="time" className={classes.hourInput} ref={lunchBreakEndRef} step="1" required/>
        </span>

        <span className={classes.hoursSpan}>
        <label>Sluta Arbete:</label>
        <input type="time" className={classes.hourInput} ref={endWorkRef} step="1" required/>
        </span>
      </div>
      <button className={classes.button} onClick={saveSelectedHours}>Save</button>
      

      
      {<ul className={classes.list}>
        <div className={classes.mainDiv}>
          {fetchedHours
            .filter((hour) => {
              // Convert the date string to Date object for comparison
              const hourDate = new Date(hour.date);
              // Check if the hour's date matches the selected date
              return ((hourDate.toDateString() === selectedDate.toDateString()) && (parseInt(hour.serviceId) === parseInt(selectedServiceId)));
            })
            .map((hour, index) => 
              {
                return(
                <button
                disabled={!hour.isAvailable}
                className={classes.button}
                key={index}
                onClick={() => handleHourDelete(hour)}
              >
                {hour.startTime.substring(0, 5)}
              </button>
              )}
              
            )}
        </div>
      </ul>}
      <div className={classes.logoutDiv}>
        <button className={classes.button} onClick={() => navigate("/Bookings")}> Bookings </button>
        <button className={classes.logoutBtn} onClick={(logout)}>Logout</button>
        <button className={classes.button} onClick={() => navigate("/Services")}> Services </button>
        <button className={classes.button} onClick={() => navigate("/SearchableBookings")}> All Bookings </button>
    </div>
    </div>

    </>

  );
}




export async function loader(){
    // get employee data from backend.
    try {
        const token = getAuthToken();
        const employeeId = getEmployeeId();
        const response = await fetch(`https://localhost:7087/api/Admin/getEmployee/${employeeId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch employee data");
        }

        // Optionally, you can extract and return the employee data if needed
        const employeeData = await response.json();
        
        return employeeData;
    } catch (error) {
        console.error("Error fetching employee data:", error);
        throw error; // Propagate the error to handle it in the route
    }


}
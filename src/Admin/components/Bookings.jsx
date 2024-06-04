import { useEffect, useState } from "react";
import { getAuthToken, getEmployeeId } from "../../util/getAuthToken";
import Calendar from "react-calendar";
import classes from "./Bookings.module.css"
import { getEmployeesServices } from "../../util/getEmployeeServices";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [services, setServices] = useState([])

  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = getAuthToken();
        const employeeId = getEmployeeId();
        const services = await getEmployeesServices(employeeId);
        
        setServices(services)

        const response = await fetch(
          `https://localhost:7087/api/Admin/GetBookings/${employeeId}`, // Assuming this endpoint returns bookings for the logged-in employee
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Include authorization token in the request headers
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings.");
        }

        const data = await response.json();
        
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        // Optionally handle errors by displaying a message to the user
      }
    }


    fetchBookings();
  }, []);

  function handleDateChange(date) {
    const timezoneOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const adjustedDate = new Date(date - timezoneOffset);
    setSelectedDate(adjustedDate)
  }

  // Filter bookings based on the selected date
  const filteredBookings = bookings.filter(
    (booking) =>
      new Date(booking.date).toDateString() ===
      selectedDate.toDateString()
  );

  // Sort filteredBookings by startTime before mapping
  const sortedBookings = filteredBookings.sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  return (
    <div className={classes.mainBigDiv}>
      <h1>Bookings</h1>

      <Calendar className={classes.calendar}
        onChange={handleDateChange}
        minDate={new Date()}
        value={selectedDate}
      />
        <h2>Vald datum: <br /> {selectedDate.toISOString().split('T')[0]}</h2>
        <div className={classes.mainDiv}>
            <ul className={classes.bookingsList}>
                {sortedBookings.map((booking) => (
                    <li key={booking.id}>
                        <div className={classes.bookingsInfoDiv}>
                            <span >Tid: {booking.startTime}</span>
                            <span>{services
                                .filter(service => service.id == booking.serviceId)
                                .map(service => (
                                  <span key={service.id}>{service.name}</span>
                                ))}</span>
                            <span>{booking.name}</span>
                            <span> {booking.email}</span>
                            <span>{booking.phone}</span>
                        </div>
                    
                    </li>
                ))}
            </ul>
        </div>
        
    </div>
  );
}

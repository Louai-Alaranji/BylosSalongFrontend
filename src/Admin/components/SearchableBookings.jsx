import { useEffect, useState } from "react";
import classes from "./SearchableBookings.module.css"
import { getAuthToken, getEmployeeId } from "../../util/getAuthToken";
import { getEmployeesServices } from "../../util/getEmployeeServices";


function SearchableBookings(){
// Add state variables for search input and filtered bookings
const [searchInput, setSearchInput] = useState('');
const [filteredBookings, setFilteredBookings] = useState([]);
const [services, setServices] = useState([])
const [bookings, setBookings] = useState([]);
// Function to handle search input change
const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };
  
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
  // Function to handle search button click
  const handleSearch = () => {
    const filtered = bookings.filter((booking) =>
      booking.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchInput.toLowerCase())
    );
    const sortedFilteredBookings = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredBookings(sortedFilteredBookings);
  };
  
  // Render the input field and search button
  return (
      <div className={classes.mainBigDiv}>
        <h1>Bokningar</h1>
    
       
        {/* Search input and button */}
        <input
            className={classes.input}
          type="text"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <button className={classes.searchbookButton} onClick={handleSearch}>Search</button>
    
        {/* Display filtered bookings */}
        <div className={classes.mainDiv}>
          <ul className={classes.bookingsList}>
            {/* Render filtered bookings */}
            {filteredBookings.map((booking) => (
              <li key={booking.id}>
                <div className={classes.bookingsInfoDiv}>
                  <span>Tid: {booking.startTime}</span>
                  <span>{services
                    .filter(service => service.id == booking.serviceId)
                    .map(service => (
                      <span key={service.id}>{service.name}</span>
                    ))}</span>
                  <span>{booking.name}</span>
                  <span>{booking.email}</span>
                  <span>{booking.phone}</span>
                  <span>Datum: {new Date(booking.date).toISOString().split('T')[0]}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}


  export default SearchableBookings;
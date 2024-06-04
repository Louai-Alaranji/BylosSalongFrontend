import { getAuthToken } from "./getAuthToken.js";

export async function getEmployeesServices(employeeId) {
    try {
      if (employeeId === null) {
        return []; // Or handle the null employeeId case as needed
    }
      const token = getAuthToken(); 

      const response = await fetch(
        `https://localhost:7087/api/Admin/getEmployeesServices/${employeeId}`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch employee services.");
      }
  
      const fetchedEmployeeServices = await response.json();
      
      return fetchedEmployeeServices;
    } catch (error) {
      console.error("Failed to fetch employee services:", error);
      // Optionally handle errors by displaying a message to the user
    }
  }
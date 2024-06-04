import { getAuthToken } from "./getAuthToken.js";

export async function getAvailableHours(employeeId) {
    try {
      const token = getAuthToken(); 

      const response = await fetch(
        `https://localhost:7087/api/Admin/employees/${employeeId}/getavailablehours`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch available hours.");
      }
  
      const fetchedAvailableHours = await response.json();
      return fetchedAvailableHours;
    } catch (error) {
      console.error("Error fetching available hours:", error);
      // Optionally handle errors by displaying a message to the user
    }
  }
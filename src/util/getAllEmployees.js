import { getAuthToken } from "./getAuthToken.js";

export async function getAllEmployees() {
    try {
  
        const response = await fetch(
          `https://localhost:7087/api/User/GetAllEmployees`
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch available hours.");
        }
    
        const allEmployees = await response.json();
        return allEmployees;
      } catch (error) {
        console.error("Error fetching available hours:", error);
        // Optionally handle errors by displaying a message to the user
      }
}
import { getAuthToken } from "./getAuthToken.js";

export async function deleteHour(hourobject) {
  try {
    const token = getAuthToken();

    const response = await fetch(`https://localhost:7087/api/Admin/DeleteSelectedHour/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(hourobject)
    });

    if (!response.ok) {
      throw new Error("Failed to delete hour.");
    }

  } catch (error) {
    console.error("Error deleting hour:", error);
    throw error; // Propagate the error to handle it where the function is called
  }
}

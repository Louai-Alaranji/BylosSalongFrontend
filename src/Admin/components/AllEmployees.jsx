import { useState } from "react"
import {useLoaderData} from "react-router-dom"
import { getAllEmployees } from "../../util/getAllEmployees.js"
import { getAuthToken } from "../../util/getAuthToken.js"
import classes from "./AllEmployee.module.css"
export default function AllEmployees(){
    const allEmployees = useLoaderData()
    const [employeesList, setEmployeesList] = useState(allEmployees)
    const employeePic = allEmployees.imageName;

    function handleDeleteEmployee(id){
        const token = getAuthToken();
        fetch(`https://localhost:7087/api/Admin/DeleteEmployee/${id}`,{
            method: "DELETE",
            headers:{
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            if(!response.ok){
                throw new Error("failed to delete, try again")
            }

            alert("employee deleted successfully!")
            return getAllEmployees();
        }).then(updatedEmployeeList =>{
            
            setEmployeesList(updatedEmployeeList);

        }

        )
        
    }
    return(
        <div className={classes.allEmployeesDiv}>
            <h1 className={classes.allEmployeesh1}>Alla Anställda</h1>
            <ul className={classes.mainList}>
                {employeesList.map((employee) => (
                    <li key={employee.id}>
                        <div className={classes.employeeWrapper}>
                            <div className={classes.imgNameWrapper}>
                                <img className={classes.profileImg} src={`https://localhost:7087/images/${employee.imageName}`}/>
                                <h3>{employee.name} </h3>
                            </div>
                            
                            <button className={classes.deleteButton} onClick={() => handleDeleteEmployee(employee.id)}> Radera </button>
                        </div>
                    </li>

                ) 
                )}
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

        // Optionally, you can extract and return the employee data if needed
        const employeesList = await response.json();
        
        return employeesList;
    } catch{
        throw error; // Propagate the error to handle it in the route
    }
    
} 
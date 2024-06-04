export function getAuthToken(){
    const token = localStorage.getItem("token");
    return token;
}

export function getEmployeeId(){
    const employeeId = localStorage.getItem("employeeId");
    return employeeId;
}
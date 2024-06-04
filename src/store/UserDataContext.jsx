import { createContext, useState } from "react";

const UserDataContext = createContext({
    employeeId: "",
    selectedDate: new Date(),
    selectedHour: 0,
    handleDate: ()=> {},
    handleHour: () => {},
    handleEmployeeId: () => {},
    handleAvailableHours: () =>{},

});

export function UserDataContextProvider({ children }) {
    const [employeeId, setEmployeeId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(null);
    const[availableHours, setAvailablehours] = useState([])


    function handleEmployeeId(id) {
        setEmployeeId(id);
    }

    function handleDate(newDate) {
        setSelectedDate(newDate);
    }

    function handleHour(newHour) {
        setSelectedHour(newHour);
    }
    function handleAvailableHours(newHours){
        setAvailablehours(newHours)
    }

    const UserDataCtx = {
        employeeId,
        selectedDate,
        selectedHour,
        availableHours,

        handleDate,
        handleHour,
        handleEmployeeId,
        handleAvailableHours,


    };

    return (
        <UserDataContext.Provider value={UserDataCtx}>
            {children}
        </UserDataContext.Provider>
    );
}

export default UserDataContext;

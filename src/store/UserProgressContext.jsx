import { createContext, useState } from "react";

const UserProgressContext = createContext({
    progress : "",
    showModal: () => {},
    hideModal: () => {},
    showSuccess: () => {},
    hideSuccess: () => {},
})


export function UserProgressContextProvider({children}){

    const [userProgress, setUserProgress] = useState("")

    function showModal(){
        setUserProgress("modal")
    }
    function hideModal(){
        setUserProgress("")
    }
    function showSuccess(){
        setUserProgress("success")
    }
    function hideSuccess(){
        setUserProgress("")
    }

    const userProgressCtx = {
        progress : userProgress,
        showModal,
        hideModal,
        showSuccess,
        hideSuccess
    }

    return(<UserProgressContext.Provider value={userProgressCtx}>
        {children}
    </UserProgressContext.Provider>)
}

export default UserProgressContext;
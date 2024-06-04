import UserProgressContext from "../store/UserProgressContext"
import { useContext } from "react"
import Modal from "./Modal.jsx"
import classes from "./Success.module.css"
export default function Success(){
    const userProgressCtx = useContext(UserProgressContext)
    

    function handleClose(){
        
        userProgressCtx.hideSuccess()
        location.reload();
    }
    return(
        <> 
        <Modal className={classes.successModal} open={userProgressCtx.progress == "success"}>
            <h1 className={classes.successh1}>Tack för din bokning!</h1>
            <h2 className={classes.successh2}>Du har fått en bekräftelsemejl till din e-postadress</h2>
            <button className={classes.successbutton} onClick={handleClose}>close</button>
        </Modal>
            
        </>
    )
}

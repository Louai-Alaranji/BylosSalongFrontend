import { useEffect, useRef } from "react"
import classes from "./Success.module.css"

export default function Modal({children, open}){
    const dialog = useRef()
    
    useEffect(() => {
        // recommended
        const modal = dialog.current; 
        if(open){
            modal.showModal()
        }
        return () => modal.close()
        
    }, [open])

    return (
        <>
            <dialog  ref={dialog} className={classes.modal}>{children} </dialog>
        </>
    )
}
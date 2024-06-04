import classes from "./Hero.module.css"
import { useNavigate } from "react-router-dom";
export default function Hero(){
    const navigate = useNavigate();

    return(
        <>
        <div className={classes.container}>

            <img className={classes.gfg} src=
            "https://media.istockphoto.com/id/636830292/photo/side-view-portrait-of-thinking-stylish-young-man-looking-away.jpg?s=612x612&w=0&k=20&c=hiacAHKiYZgof4rMzz6d4QXAW7oZUXX2c7pGPjZZ8Uw="/>
            
            <div className={classes.logo}>
                <h1 className={classes.AgencyName}>Bylos Salong</h1>
                
                {/*<p> Website & Booking System <br />
                No upfront payment required</p>*/}
                <button className={classes.bookTimeButton} onClick={() => { navigate("/UserBookingPage")}}>Boka Tid</button>
            </div>
        </div>
        </>
    )
}
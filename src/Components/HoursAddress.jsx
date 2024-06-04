import classes from "./HoursAddress.module.css";

export default function HoursAddress() {
    return (
        <section className={classes.openingHoursSection}>
            <div className={classes.backgroundImage}></div>
            <div className={classes.content}>
                <h2>Öppettider</h2>
                <p>Mån-tors: 09:00-18:00</p>
                <p>Fredag: 09:00-20:00</p>
                <p>Lördag: 10:00-18:00</p>
                <p>Söndag: 10:00-15:00</p>
                <h2>Adress & Kontakt</h2>
                <p> Torpagatan 11, 553 33 Jönköping <br /> 036-19 09 90 </p> 
               
            </div>
            
        </section>
    );
}

import classes from "./Services.module.css";

export default function Services() {
    return (
        <div className={classes.servicesSection}>
            <h2>Tjänster & Priser</h2>
            <div className={classes.serviceCategory}>
                <h3>Klippning</h3>
                <ul>
                    <li>Ordinarie 299:-</li>
                    <li>Student 249:-</li>
                    <li>Barn 249:-</li>
                    <li>Pensionär 200:-</li>
                </ul>
            </div>
            <div className={classes.serviceCategory}>
                <h3>Klipp & Skägg</h3>
                <ul>
                    <li>Ordinarie 399:-</li>
                    <li>Student 349:-</li>
                    <li>Pensionär 349:-</li>
                    <li>All inclusive 599:-</li>
                </ul>
            </div>
            <div className={classes.serviceCategory}>
                <h3>Övrigt</h3>
                <ul>
                    <li>Skägg 249:-</li>
                    <li>Trådning 49:-</li>
                    <li>Vaxning 79:-</li>
                </ul>
            </div>
        </div>
    );
}

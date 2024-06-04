import classes from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={classes.FooterMainDiv}>
            <div className={classes.FooterContent}>
                <p>&copy; {new Date().getFullYear()} Bylos Salong</p>
                <div className={classes.ContactInfo}>
                    <p>Email: </p>
                    <p>Phone: </p>
                </div>
                <div className={classes.SocialMedia}>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
            </div>
        </footer>
    );
}

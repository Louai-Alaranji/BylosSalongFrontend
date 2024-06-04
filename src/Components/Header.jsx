import classes from "./Header.module.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Header(){
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={classes.header}>
                <div className={classes.logoName}>
                    <img className={classes.logo} src="/BylosLogo.png" alt="al aranji sisters beauty center logo image" />
                    <h1 className={classes.businessName}>Bylos <br />Salong</h1>
                </div>
                <div className={classes.navButtons}>
                    <button onClick={() => navigate("/login")} className={classes.headerButtons}>
                        Login
                    </button>
                    { /* <button className={classes.headerButtons}>
                        Kontakt
                    </button>
                    <button className={classes.headerButtons}>
                        Tjänster
                    </button> */}
                </div>
                <div className={classes.hamburgerMenu} onClick={toggleMenu}>
                    &#9776;
                </div>
                {menuOpen && (
                    <div className={classes.dropdownMenu}>
                        <button onClick={() => navigate("/login")} className={classes.headerButtons}>
                            Login
                        </button>
                        { /* <button className={classes.headerButtons}>
                        Kontakt
                        </button>
                        <button className={classes.headerButtons}>
                            Tjänster
                        </button> */}
                    </div>
                )}
            </header>
    )
}
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faRightFromBracket, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
  logout();
  navigate("/");
};

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_container}>
        <div className={styles.navbar_logo} onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHouse} style={{ color: "#FFD43B", marginRight: "8px" }} />
          EstateVault
        </div>

        <div className={styles.navbar_links}>
          <Link to="/properties" className={styles.nav_item}>
            Browse
          </Link>

          {user && (
            <Link
              to={user.role === "buyer" ? "/buyer-dashboard" : "/seller-dashboard"}
              className={styles.dashboard_link}
            >
              <FontAwesomeIcon icon={faTableCells} />
              Dashboard
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className={styles.nav_item}>
                Login
              </Link>

              <Link to="/signup" className={styles.signup_button}>
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <>
              <span className={styles.role}>{user.name}</span>

              <button onClick={handleLogout} className={styles.logout_btn}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </button>
            </>
          )}
        </div>


      </div>
    </nav>
  );
};

export default Navbar;

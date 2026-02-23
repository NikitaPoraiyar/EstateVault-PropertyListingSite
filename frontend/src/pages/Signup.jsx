import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/signup.module.css";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";


const Signup = () => {

  const [ role, setRole ] = useState("buyer");

  const navigate = useNavigate();

  const handleSignup = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;

    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("https://estatevault-backend.onrender.com/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    navigate("/login");
  };



  return (
    <div className={styles.signup_maincontainer}>
      <Navbar />
      <div className={styles.signup_wrapper}>
        <div className={styles.signup_card}>

          <h2>Create Account</h2>
          <p className={styles.subtitle}>Join as a buyer or seller</p>

          {/* Role Toggle */}
          <div className={styles.role_toggle}>
            <button
              className={`${styles.role_button} ${
                role === "buyer" ? styles.active : ""
              }`}
              onClick={() => setRole("buyer")}
            >
              🏠 Buyer
            </button>

            <button
              className={`${styles.role_button} ${
                role === "seller" ? styles.active : ""
              }`}
              onClick={() => setRole("seller")}
            >
              🏗 Seller
            </button>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSignup(role); }}>

            <div className={styles.form_group}>
              <label>Full Name</label>
              <input id="name" type="text" placeholder="John Doe" />
            </div>

            <div className={styles.form_group}>
              <label>Email</label>
              <input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className={styles.form_group}>
              <label>Password</label>
              <input id="password" type="password" placeholder="Min 6 characters" />
            </div>

            <button type="button" onClick={handleSignup} className={styles.signup_button}>
              Sign Up as {role === "buyer" ? "Buyer" : "Seller"}
            </button>

          </form>

          <div className={styles.signup_footer}>
            Already have an account? <Link to="/login">Log in</Link>
          </div>

        </div>
      </div>

      <footer className={styles.footer}>
        © 2026 EstateVault. All rights reserved.
      </footer>
    </div>
  );
};

export default Signup;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "../styles/login.module.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save user in auth context
      login(data.email, data.role, data.name);

      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className={styles.login_container}>
      <Navbar />

      <div className={styles.login_page}>
        <div className={styles.login_card}>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>

          <form onSubmit={handleLogin} autoComplete="off">

            <div className={styles.form_group}>
              <label>Email</label>
              <input
                autoComplete="new-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>

            <div className={styles.form_group}>
              <label>Password</label>
              <input
                autoComplete="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className={styles.login_button}>
              Sign In
            </button>

          </form>

          <div className={styles.login_footer}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        © 2026 EstateVault. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;

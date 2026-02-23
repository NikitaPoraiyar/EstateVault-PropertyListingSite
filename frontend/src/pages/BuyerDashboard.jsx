import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/buyerdashboard.module.css";
import { useAuth } from "../context/AuthContext";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/inquiries/buyer/${user.email}`)
      .then(res => res.json())
      .then(setInquiries);
  }, []);

  return (
    <div className={styles.buyerDashboard_maincontainer}>
      <Navbar />

      <div className={styles.buyer_content}>
        <h1>Buyer Dashboard</h1>
        <h3>My Inquiries ({inquiries.length})</h3>

        {inquiries.length === 0 ? (
          <p>No inquiries yet.</p>
        ) : (
          inquiries.map(i => (
            <div key={i.id} className={styles.inquiry_card}>
              <strong>{i.propertyTitle}</strong>
              <p>{i.message}</p>
            </div>
          ))
        )}
      </div>
      <footer className={styles.footer}>
        © 2026 EstateVault. All rights reserved.
      </footer>
    </div>
  );
};

export default BuyerDashboard;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import styles from "../styles/home.module.css";
import PropertyCard from "@/components/PropertyCard";
import Banner from '../assets/banner_bg.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBuilding, faUsers, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";



const Home = () => {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [showBuyerModal, setShowBuyerModal] = useState(false);

  useEffect(() => {
    fetch("https://estatevault-backend.onrender.com/api/properties")
      .then(res => res.json())
      .then(data => setFeatured(data))
      .catch(err => console.error(err));
  }, []);





  return (
    <div className={styles.home_container}>
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className={styles.banner_homecontainer}>
        <div className={styles.bannerimg_container}>
          <img src={Banner} alt="Banner" className={styles.banner_imagehome} />
        </div>
        <div className={styles.banner_content}>
          <h1>Find Your <span>Dream Property</span></h1>
          <p>Discover the perfect home that matches your lifestyle and preferences.</p>
          <div className={styles.banner_button_container}>
            <Link to="/properties" className={styles.primarybutton}> <FontAwesomeIcon icon={faMagnifyingGlass} /> Browse Properties </Link>
            <button
              className={styles.secondarybutton}
              onClick={() => {
                if (!user) {
                  navigate("/signup");
                } else if (user.role === "seller") {
                  navigate("/seller-dashboard");
                } else {
                  setShowBuyerModal(true);
                }
              }}
            >
              List Your Properties →
            </button>


          </div>
        </div>
      </div>

      <section className={styles.stats_section}>
        <div className={styles.stats_container}>
          <div className={styles.stat_item}>
            <FontAwesomeIcon icon={faBuilding} className={styles.stat_icon} />
            <h2>500+</h2>
            <p>Properties Listed</p>
          </div>
          <div className={styles.stat_item}>
            <FontAwesomeIcon icon={faUsers} className={styles.stat_icon} />
            <h2>1200+</h2>
            <p>Happy Clients</p>
          </div>
          <div className={styles.stat_item}>
            <FontAwesomeIcon icon={faShieldHalved} className={styles.stat_icon} />
            <h2>100%</h2>
            <p>Verified Listings</p>
          </div>
        </div>
      </section>

      <section className={styles.featured_section}>
        <div className={styles.featured_header}>
          <div>
            <h2>Featured Properties</h2>
            <p>Handpicked listings just for you</p>
          </div>
          <Link to="/properties" className={styles.featured_viewall}>
            View All →
          </Link>
        </div>
        <div className={styles.featured_grid}>
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {/* <div className={styles.featured_box}>
          <p>No featured properties yet. Be the first to list!</p>
          <Link to="/dashboard" className={styles.featured_button}>
            Get Started
          </Link>
        </div> */}
      </section>

      {showBuyerModal && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_box}>

            <h3>You are logged in as Buyer</h3>

            <p style={{ marginTop: "10px" }}>
              Please logout and create a Seller account to list properties.
            </p>

            <button
              style={{ marginTop: "20px" }}
              onClick={() => setShowBuyerModal(false)}
            >
              OK
            </button>

          </div>
        </div>
      )}


      {/* Footer */}
      <footer className={styles.footer}>
        © 2026 EstateVault. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;



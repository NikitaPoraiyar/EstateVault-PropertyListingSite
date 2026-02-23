import { Link } from "react-router-dom";
import styles from "../styles/propertycard.module.css";
import image from "../assets/villaimg_dummy.jpg";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";


const PropertyCard = ({ property }) => {

  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`https://estatevault-backend.onrender.com/api/ratings/${property.id}`)
      .then((res) => res.json())
      .then((data) => {
        setLikes(data.likes);
        setDislikes(data.dislikes);
      });
  }, [property.id]);

  const react = async (rating) => {

    if (!user) return alert("Login first");
    setLoading(true);
    await fetch("https://estatevault-backend.onrender.com/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.email,
        propertyId: property.id,
        rating,
      }),
    });
    const res = await fetch(`https://estatevault-backend.onrender.com/api/ratings/${property.id}`);
    const data = await res.json();

    setLikes(data.likes);
    setDislikes(data.dislikes);
    setLoading(false);
  };



  return (
    
      <div className={styles.propertyCard_maincontainer}>
        <div className={styles.card}>
          <Link to={`/properties/${property.id}`} className={styles.card_link}>
            <img src={property.imageUrl} alt={property.title} className={styles.image} />

            <div className={styles.body}>
              <p className={styles.price}>₹{property.price}</p>

              <h3 className={styles.title}>{property.title}</h3>

              <p className={styles.location}>
                {property.address}, {property.city}
              </p>

              <div className={styles.meta}>
                <span>🛏 {property.bedrooms}</span>
                <span>🚿 {property.bathrooms}</span>
                <span>📐 {property.area_sqft} sqft</span>
              </div>
            </div>
          </Link>
          {user?.role === "buyer" && (
            <div className={styles.reactions}>
              <button type="button" className={styles.likebtn} disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  react(1);
                }}
              >
                <FontAwesomeIcon icon={faThumbsUp} />{" "}
                {likes}
              </button>

              <button type="button" className={styles.dislikebtn} disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  react(-1);
                }}
              >
                <FontAwesomeIcon icon={faThumbsDown} />{" "}
                {dislikes}
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default PropertyCard;

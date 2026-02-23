import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/propertydetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faBed, faBath, faExpand, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [message, setMessage] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [ loading, setLoading ] = useState(false);
  const [recommend, setRecommend] = useState([]);


  useEffect(() => {
    fetch("https://estatevault-backend.onrender.com/api/properties")
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === id);
        setProperty(found);
      });
  }, [id]);

  useEffect(() => {
    fetch(`https://estatevault-backend.onrender.com/api/ratings/${id}`)
      .then(res => res.json())
      .then(data => {
        setLikes(data.likes);
        setDislikes(data.dislikes);
      });
  }, [id]);

  
  useEffect(() => {
  fetch(`https://estatevault-backend.onrender.com/api/properties/similar/${id}`)
    .then(res => res.json())   
    .then(data => {
      console.log(data);       
      setRecommend(data);     
    })
    .catch(err => console.error(err));
}, [id]);

  if (!property) return <p>Loading...</p>;

  const react = async (rating) => {
    if (!user) return alert("Login first");

    await fetch("https://estatevault-backend.onrender.com/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.email,
        propertyId: id,
        rating
      })
    });

    const res = await fetch(`https://estatevault-backend.onrender.com/api/ratings/${id}`);
    const data = await res.json();

    setLikes(data.likes);
    setDislikes(data.dislikes);
  };

  const sendInquiry = async () => {
    if (!message) return alert("Enter inquiry message");

    const res = await fetch("https://estatevault-backend.onrender.com/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        propertyId: property.id,
        propertyTitle: property.title,
        sellerId: property.sellerId,
        buyerEmail: user.email,
        message,
      }),
    });

    if (res.ok) {
      alert("Inquiry sent!");
      setMessage("");
    } else {
      alert("Error sending inquiry");
    }
  };




  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.image_wrap}>
        <img src={property.imageUrl} alt={property.title} />

        <span className={styles.badge}>For Sale</span>

        {user?.role === "buyer" && (
          <div className={styles.image_reactions}>
            <button
              onClick={() => react(1)}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faThumbsUp} /> {likes}
            </button>

            <button
              onClick={() => react(-1)}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faThumbsDown} /> {dislikes}
            </button>
          </div>
        )}
      </div>


      <div className={styles.container}>
        <div className={styles.grid}>

          <div className={styles.leftside}>
            <p className={styles.price}>₹{property.price}</p>
            <h1>{property.title}</h1>

            <p className={styles.location}>
              <FontAwesomeIcon icon={faLocationDot} /> {property.address}, {property.city}
            </p>

            <div className={styles.meta}>
              <span><FontAwesomeIcon icon={faBed} /> {property.bedrooms}</span>
              <span><FontAwesomeIcon icon={faBath} /> {property.bathrooms}</span>
              <span><FontAwesomeIcon icon={faExpand} /> {property.area_sqft} sqft</span>
            </div>

            <h3>Description</h3>
            <p>{property.description}</p>

          </div>

          <div className={styles.rightside}>

            {user?.role === "buyer" && (
              <div className={styles.inquiry_box}>
                <h3>Send Inquiry</h3>

                <textarea
                  placeholder="I'm interested in this property..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button onClick={sendInquiry} className={styles.send_btn}>
                  Send Inquiry
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
      <hr />
      <div className={styles.similarproperties_section}>
        <h1 className={styles.similarsection_title}>Similar Properties</h1>
        <div className={styles.featured_grid}>
          {recommend.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
      
      <footer className={styles.footer}>
        © 2026 EstateVault. All rights reserved.
      </footer>

    </div>
  );
};

export default PropertyDetails;

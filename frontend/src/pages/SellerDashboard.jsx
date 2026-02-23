import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/sellerdashboard.module.css";
import { useAuth } from "../context/AuthContext";

const SellerDashboard = () => {
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    city: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    description: "",
    type: "",
  });

  useEffect(() => {
    fetch("https://estatevault-backend.onrender.com/api/properties")
      .then((res) => res.json())
      .then((data) => {
        const mine = data.filter((p) => p.sellerId === user.email);
        setProperties(mine);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetch(`https://estatevault-backend.onrender.com/api/inquiries/seller/${user.email}`)
      .then(res => res.json())
      .then(data => setInquiries(data));
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      formData.append("sellerId", user.email);
      formData.append("image", image);

      await fetch("https://estatevault-backend.onrender.com/api/properties", {
        method: "POST",
        body: formData,   
      });

      setForm({
        title: "",
        price: "",
        city: "",
        address: "",
        bedrooms: "",
        bathrooms: "",
        area_sqft: "",
        description: "",
        type: "",
      });

      setImage(null);
      setShowModal(false);

      const res = await fetch("https://estatevault-backend.onrender.com/api/properties");
      const data = await res.json();
      setProperties(data.filter((p) => p.sellerId === user.email));

    } catch (err) {
      console.error(err);
      alert("Property upload failed");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    try {
      await fetch(`https://estatevault-backend.onrender.com/api/properties/${id}`, {
        method: "DELETE",
      });

      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };


  return (
    <div className={styles.seller_container}>
      <Navbar />

      <div className={styles.seller_content}>
        <h1>Seller Dashboard</h1>

        <div className={styles.properties_header}>
          <h3>My Properties ({properties.length})</h3>

          <button className={styles.add_button} onClick={() => setShowModal(true)}>
            + Add Property
          </button>
        </div>

        {properties.length === 0 ? (
          <p className={styles.empty}>You haven't listed any properties yet.</p>
        ) : (
          properties.map((p) => (
            <div key={p.id} className={styles.property_card}>
              <div>
                <strong>{p.title}</strong>
                <p>{p.city}</p>
              </div>
              <div className={styles.actions}>
                <span className={styles.tag}>Active</span>

                <button
                  className={styles.remove_btn}
                  onClick={() => deleteProperty(p.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}

        <h3 className={styles.inquiries}>Inquiries</h3>
        {inquiries.length === 0 ? (
          <p>No inquiries yet.</p>
        ) : (
          inquiries.map(i => (
            <div key={i.id} className={styles.inquiry_card}>
              <strong>{i.propertyTitle}</strong>
              <p>{i.message}</p>
              <small>{i.buyerEmail}</small>
            </div>
          ))
        )}
      
      </div>

      {showModal && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <div className={styles.modal_header}>
              <h2>List New Property</h2>
              <span onClick={() => setShowModal(false)}>✕</span>
            </div>

            <form onSubmit={handleSubmit} className={styles.modal_form}>

              <input placeholder="Title" value={form.title}
                onChange={(e)=>setForm({...form,title:e.target.value})} required />

              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required >
                <option value="" disabled>Select Property Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>

              <textarea placeholder="Description"
                value={form.description}
                onChange={(e)=>setForm({...form,description:e.target.value})} />

              <div className={styles.two_col}>
                <input type="number" placeholder="Price"
                  value={form.price}
                  onChange={(e)=>setForm({...form,price:e.target.value})} />

                <input type="number" placeholder="Area sqft"
                  value={form.area_sqft}
                  onChange={(e)=>setForm({...form,area_sqft:e.target.value})} />
              </div>

              <div className={styles.two_col}>
                <input type="number" placeholder="Bedrooms"
                  value={form.bedrooms}
                  onChange={(e)=>setForm({...form,bedrooms:e.target.value})} />

                <input type="number" placeholder="Bathrooms"
                  value={form.bathrooms}
                  onChange={(e)=>setForm({...form,bathrooms:e.target.value})} />
              </div>

              <input placeholder="Address"
                value={form.address}
                onChange={(e)=>setForm({...form,address:e.target.value})} />

              <input placeholder="City"
                value={form.city}
                onChange={(e)=>setForm({...form,city:e.target.value})} />

                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

              <button type="submit" className={styles.submit_btn}>
                List Property
              </button>

            </form>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        © 2026 EstateVault. All rights reserved.
      </footer>
    </div>
  );
};

export default SellerDashboard;

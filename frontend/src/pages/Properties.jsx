import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import styles from "../styles/properties.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import PropertyCard from "@/components/PropertyCard";

const Properties = () => {

  const [properties, setProperties] = useState([]);
  const [ filtered, setFiltered ] = useState([]);
  const [ search, setSearch ] = useState("");
  const [ type, setType ] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/properties")
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setFiltered(data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleSearch = () => {
  let result = properties;

  if (type !== "All") {
    result = result.filter( p => p.type?.toLowerCase() === type.toLowerCase() );
  }

  if (search.trim()) {
    result = result.filter(p =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase())
    );
  }

  setFiltered(result);
};




  return (
    <div className={styles.properties_container}>
      <Navbar />

      <div className={styles.browse_section}>
        <h2 className={styles.browse_title}>Browse Properties</h2>
        {/* Filters */}
        <div className={styles.browse_filters}>
          <div className={styles.browse_search}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input placeholder="Search by title, city, or address..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <select className={styles.browse_select} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="plot">Plot</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
          </select>
          
          <button className={styles.browse_button} onClick={handleSearch}>Search</button>
        </div>
        
        {filtered.length === 0 ? (
          <div className={styles.browse_empty}>
            No properties found. Try adjusting your filters.
          </div>
        ) : (
          <div className={styles.properties_grid}>
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        © 2026 EstateVault. All rights reserved.
      </footer>
    </div>
  );
};

export default Properties;

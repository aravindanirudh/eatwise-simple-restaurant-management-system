import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Update = () => {
  // Hook for navigation and getting the current location
  const navigate = useNavigate();
  const location = useLocation();

  // This is for getting the id of the item to be updated from the URL
  const itemId = location.pathname.split("/")[2];

  // State to hold the item details
  const [item, setItem] = useState({
    item_name: "",
    category: "",
    price: "",
    item_picture: ""
  });

  // Fetch the current item details when the component mounts
  React.useEffect(() => {
    axios.get(`http://localhost:8800/menu_items/${itemId}`)
      .then(res => setItem(res.data))
      .catch(err => console.log(err));
  }, [itemId]);

  // Handle input changes
  const handleChange = e => {
    setItem(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission to update the item
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/menu_items/${itemId}`, item);
      navigate("/admin");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <section className="update-section">
      <div className="update-glass-container">
        <h2>Update Menu Item</h2>
        <form className="update-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            value={item.item_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={item.category}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={item.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="item_picture"
            placeholder="Image URL"
            value={item.item_picture}
            onChange={handleChange}
          />
          <button type="submit" className="font-changer">Update Item</button>
        </form>
        <Link to="/admin" className="update-back-btn">Back</Link>
      </div>
    </section>
  );
};

export default Update;
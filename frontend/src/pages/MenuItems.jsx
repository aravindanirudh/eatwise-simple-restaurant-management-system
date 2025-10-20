import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const MenuItems = () => {
  // State to hold menu items
  const [menuItems, setMenuItems] = useState([]);

  // Fetch menu items from the backend when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get("http://localhost:8800/menu_items");
        setMenuItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMenuItems();
  }, []);

  // Function to handle deletion of a menu item
  const handleClick = async (id) => {
    try {
      await axios.delete("http://localhost:8800/menu_items/" + id);
      // To refresh the page after deletion
      window.location.reload(); 
    } catch (err) {
      console.log(err);
    } 
  }

  return (
    <div>
      <h1 style={{textAlign: 'center', marginTop: "15px", fontSize: "2rem"}}>Menu Items</h1>
      <div className="admin-menu-items-container">
        {menuItems.map((item) => (
          <div className="admin-menu-item-card" key={item.item_id}>
            {item.item_picture && (
              <img src={item.item_picture} alt={`Picture of menu item ${item.item_name}`} />
            )}
            <h3>{item.item_name}</h3>
            <p>ID: {item.item_id}</p>
            <p>Category: {item.category}</p>
            <p>Price: ₹{item.price}</p>
            <div className="admin-menu-item-actions">
              <button className='delete-button' onClick={() => handleClick(item.item_id)}>Delete</button>
              <button className='update-button'><Link to={`/update/${item.item_id}`}>Update</Link></button>
            </div>
          </div>
        ))}
      </div>
      <div style={{textAlign: 'center', marginTop: '2rem'}}>
        <button><Link to="/add">Add New Item</Link></button>
      </div>
    </div>
  )
}

export default MenuItems
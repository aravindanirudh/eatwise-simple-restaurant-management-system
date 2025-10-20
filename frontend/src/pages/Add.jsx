import { useState } from 'react'; // Importing useState hook from React
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from react-router-dom for navigation
import axios from 'axios'; // Importing axios for making HTTP requests

const Add = () => {
  // State to hold the new menu item details
  const [menuItem, setMenuItem] = useState({
    item_id: "",
    item_picture: "",
    item_name: "",
    category: "",
    price: null,
  });

  // Hook for navigation
  const navigate = useNavigate();

  // Function to handle input changes and update the state
  const handleChange = (e) => {
    setMenuItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Function to send updated data to backend server
  const handleClick = async (e) => {
    e.preventDefault(); // To prevent refreshing of the page when clicking the button
    try {
      await axios.post("http://localhost:8800/menu_items", menuItem);
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  } 

  return (
    <section className="add-section">
      <div className="add-glass-container">
        <h2>Add New Item</h2>
        <form className="add-form">
          <input type="text" placeholder="Item ID" onChange={handleChange} name='item_id' required />
          <input type="text" placeholder="Item Picture URL" onChange={handleChange} name='item_picture' required />
          <input type="text" placeholder="Item Name" onChange={handleChange} name='item_name' required />
          <input type="text" placeholder="Category" onChange={handleChange} name='category' required />
          <input type="number" placeholder="Price" onChange={handleChange} name='price' required />
          <button type="submit" onClick={handleClick} className='font-changer'>Add Item</button>
        </form>
      </div>
    </section>
  );
};

export default Add;
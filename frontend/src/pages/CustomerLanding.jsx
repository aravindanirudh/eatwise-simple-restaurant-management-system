import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CustomerLanding = () => {
  // Navigation hook to redirect users to different routes
  const navigate = useNavigate();
  // State variables to hold menu items, order items, and quantities
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  // To store logged-in user details from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // During logout, remove user from localStorage and navigate to '/' or <Homepage />
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Retrieve menu items from backend and store in state variable
  useEffect(() => {
    fetch('http://localhost:8800/menu_items')
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

  // Retrieve order items for the logged-in user and store in state variable
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8800/order_items?user_id=${user.user_id}`)
        .then(res => res.json())
        .then(data => setOrderItems(data));
    }
  }, [user]);

  // Handle quantity change
  const handleQuantityChange = (itemId, value) => {
    setQuantities(q => ({ ...q, [itemId]: value }));
  };

  // Handle order button
  const handleOrder = (item) => {
    const quantity = parseInt(quantities[item.item_id] || 1);
    if (!user) return;
    fetch('http://localhost:8800/order_items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.user_id,
        item_id: item.item_id,
        quantity,
        price: item.price
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          alert('Order failed: ' + (data.error || 'Unknown error'));
          console.error('Order error:', data);
          return;
        }
        // Refresh order items
        fetch(`http://localhost:8800/order_items?user_id=${user.user_id}`)
          .then(res => res.json())
          .then(data => setOrderItems(data));
      })
      .catch(err => {
        alert('Network error');
        console.error('Network error:', err);
      });
  };

  return (
    <section className="customer-landing-section">
      <div className="customer-landing-section-header">
        <h2>Welcome, {user?.username}!</h2>
        <button onClick={handleLogout} style={{marginTop: '20px'}}>Logout</button>
      </div>

      <div className="menu-items-container">
        {menuItems.map(item => (
          <div className="menu-item-card" key={item.item_id}>
            {item.item_picture
  ? <img src={item.item_picture} alt={item.item_name} />
  : null}
            <h3>{item.item_name}</h3>
            <p>Category: {item.category}</p>
            <p>Price: ₹{item.price}</p>
            <div className="menu-item-actions">
              <label htmlFor={`quantity-${item.item_id}`}>Qty:</label>
              <input
                type="number"
                min="1"
                value={quantities[item.item_id] || 1}
                onChange={e => handleQuantityChange(item.item_id, e.target.value)}
                style={{ width: '60px', borderRadius: '6px', border: '1px solid #ccc', padding: '4px' }}
                id={`quantity-${item.item_id}`}
              />
              <button onClick={() => handleOrder(item)}>Order</button>
            </div>
          </div>
        ))}
      </div>

      <div className="order-items-container">
        <h2>Your Orders</h2>
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Order Item ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Suborder Price</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map(order => (
              <tr key={order.order_items_id}>
                <td>{order.order_items_id}</td>
                <td>{order.item_name}</td>
                <td>{order.quantity}</td>
                <td>₹{order.suborder_price}</td>
                <td>
                  <button
                    style={{ background: '#a83232', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
                    onClick={() => {
                      fetch(`http://localhost:8800/order_items/${order.order_items_id}`, {
                        method: 'DELETE'
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            // Refresh order items
                            fetch(`http://localhost:8800/order_items?user_id=${user.user_id}`)
                              .then(res => res.json())
                              .then(data => setOrderItems(data));
                          } else {
                            alert('Delete failed');
                          }
                        });
                    }}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );    
};

export default CustomerLanding;
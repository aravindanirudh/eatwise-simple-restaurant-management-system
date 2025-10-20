import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuItems from "./MenuItems";
import Credits from "./Credits";

const AdminLanding = () => {
  // Navigation hook
  const navigate = useNavigate();

  // Logout function for removing user from local storage and redirecting to home
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Get user from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  // Reviews state
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8800/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  // Delete review function
  const handleDeleteReview = (id) => {
    fetch(`http://localhost:8800/reviews/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews((reviews) => reviews.filter((r) => r.review_id !== id));
        } else {
          alert("Delete failed");
        }
      });
  };

  // Users state
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8800/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Delete user function
  const handleDeleteUser = (id) => {
    fetch(`http://localhost:8800/users/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers((users) => users.filter((u) => u.user_id !== id));
        } else {
          alert("Delete failed");
        }
      });
  };

  // Orders Management state
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8800/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  // Delete order function
  const handleDeleteOrder = (id) => {
    fetch(`http://localhost:8800/orders/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders((orders) => orders.filter((o) => o.order_id !== id));
        } else {
          alert("Delete failed");
        }
      });
  };

  // Order Items Management state
  const [orderItems, setOrderItems] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8800/order_items?all=true")
      .then((res) => res.json())
      .then((data) => setOrderItems(data));
  }, []);

  // Delete order item function
  const handleDeleteOrderItem = (id) => {
    fetch(`http://localhost:8800/order_items/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrderItems((items) =>
            items.filter((oi) => oi.order_items_id !== id)
          );
        } else {
          alert("Delete failed");
        }
      });
  };

  return (
    <>
    <section className="admin-landing-section">
      <div className="admin-landing-section-header">
        <h2>Welcome, {user?.username}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <hr
          style={{ height: "1px", borderWidth: "0", backgroundColor: "gray" }}
        />
      <div className="admin-landing-section-content">
        <div className="admin-landing-menu-items" style={{marginBottom: '20px'}}>
          <MenuItems />
        </div>
        <hr
          style={{ height: "1px", borderWidth: "0", backgroundColor: "gray" }}
        />
        {/* Reviews Management Section */}
        <div style={{ marginTop: "10px", padding: "0 30px" }}>
          <h2 className="text-aligner" style={{ fontSize: "2rem" }}>Reviews Management</h2>
          <table
            style={{
              width: "100%",
              color: "white",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th className="text-aligner">ID</th>
                <th className="text-aligner">User</th>
                <th className="text-aligner">Description</th>
                <th className="text-aligner">Date</th>
                <th className="text-aligner">Rating</th>
                <th className="text-aligner">Delete</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.review_id}>
                  <td className="text-aligner">{r.review_id}</td>
                  <td className="text-aligner">{r.username}</td>
                  <td className="text-aligner">{r.description}</td>
                  <td className="text-aligner">{r.date}</td>
                  <td className="text-aligner">{r.rating}</td>
                  <td className="text-aligner">
                    <button
                      onClick={() => handleDeleteReview(r.review_id)}
                      style={{
                        background: "#a83232",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Add Review Form */}
          <form
            className="admin-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const body = {
                user_id: form.user_id.value,
                description: form.description.value,
                date: form.date.value,
                rating: form.rating.value,
              };
              const res = await fetch("http://localhost:8800/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              });
              const data = await res.json();
              if (data.success) {
                form.reset();
                fetch("http://localhost:8800/reviews")
                  .then((res) => res.json())
                  .then((data) => setReviews(data));
              } else {
                alert(data.error ? `Add failed: ${data.error}` : "Add failed");
              }
            }}
          >
            <input
              name="user_id"
              type="number"
              placeholder="User ID"
              required
            />
            <input
              name="description"
              type="text"
              placeholder="Description"
              required
            />
            <input name="date" type="date" required />
            <input
              name="rating"
              type="number"
              min="1"
              max="5"
              placeholder="Rating"
              required
            />
            <button type="submit" className="font-changer">Add Review</button>
          </form>
        </div>
        <hr
          style={{ height: "1px", borderWidth: "0", backgroundColor: "gray" }}
        />
        {/* Orders Management Section */}
        <div style={{ marginTop: "15px", marginBottom: "20px", padding: "0 30px" }}>
          <h2 className="text-aligner" style={{ fontSize: "2rem" }}>Orders Management</h2>
          <table
            style={{
              width: "100%",
              color: "white",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th className="text-aligner">Order ID</th>
                <th className="text-aligner">User ID</th>
                <th className="text-aligner">Order Date Time</th>
                <th className="text-aligner">Total Amount</th>
                <th className="text-aligner">Delete</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.order_id}>
                  <td className="text-aligner">{o.order_id}</td>
                  <td className="text-aligner">{o.user_id}</td>
                  <td className="text-aligner">{o.order_date_time}</td>
                  <td className="text-aligner">{o.total_amount}</td>
                  <td className="text-aligner">
                    <button
                      onClick={() => handleDeleteOrder(o.order_id)}
                      style={{
                        background: "#a83232",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr
          style={{ height: "1px", borderWidth: "0", backgroundColor: "gray" }}
        />
        {/* Order Items Management Section */}
        <div style={{ marginTop: "15px", marginBottom: "20px", padding: "0px 30px" }}>
          <h2 className="text-aligner" style={{ fontSize: "2rem" }}>Order Items Management</h2>
          <table
            style={{
              width: "100%",
              color: "white",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th className="text-aligner">Order Item ID</th>
                <th className="text-aligner">Order ID</th>
                <th className="text-aligner">Item ID</th>
                <th className="text-aligner">Quantity</th>
                <th className="text-aligner">Suborder Price</th>
                <th className="text-aligner">Delete</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((oi) => (
                <tr key={oi.order_items_id}>
                  <td className="text-aligner">{oi.order_items_id}</td>
                  <td className="text-aligner">{oi.order_id}</td>
                  <td className="text-aligner">{oi.item_id}</td>
                  <td className="text-aligner">{oi.quantity}</td>
                  <td className="text-aligner">{oi.suborder_price}</td>
                  <td className="text-aligner">
                    <button
                      onClick={() => handleDeleteOrderItem(oi.order_items_id)}
                      style={{
                        background: "#a83232",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr
          style={{ height: "1px", borderWidth: "0", backgroundColor: "gray" }}
        />
        {/* Users Management Section */}
        <div style={{ marginTop: "15px",padding: "0 30px" }}>
          <h2 className="text-aligner" style={{ fontSize: "2rem" }}>Users Management</h2>
          <table
            style={{
              width: "100%",
              color: "white",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th className="text-aligner">ID</th>
                <th className="text-aligner">Username</th>
                <th className="text-aligner">Password</th>
                <th className="text-aligner">Email</th>
                <th className="text-aligner">Role</th>
                <th className="text-aligner">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td className="text-aligner">{u.user_id}</td>
                  <td className="text-aligner">{u.username}</td>
                  <td className="text-aligner">{u.password}</td>
                  <td className="text-aligner">{u.email || "-"}</td>
                  <td className="text-aligner">{u.role}</td>
                  <td className="text-aligner">
                    <button
                      onClick={() => handleDeleteUser(u.user_id)}
                      style={{
                        background: "#a83232",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Add User Form */}
          <form
            className="admin-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const body = {
                username: form.username.value,
                password: form.password.value,
                email: form.email.value,
                role: form.role.value,
              };
              const res = await fetch("http://localhost:8800/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              });
              const data = await res.json();
              if (data.success) {
                form.reset();
                fetch("http://localhost:8800/users")
                  .then((res) => res.json())
                  .then((data) => setUsers(data));
              } else {
                alert(data.error ? `Add failed: ${data.error}` : "Add failed");
              }
            }}
          >
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
            />
            <input
              name="password"
              type="text"
              placeholder="Password"
              required
            />
            <input name="email" type="email" placeholder="Email" />
            <select
              name="role"
              required
              style={{
                background: "rgba(30,41,59,0.15)",
                color: "white",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "1rem",
              }}
            >
              <option value="" disabled>
                Role
              </option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
            </select>
            <button type="submit" className="font-changer">Add User</button>
          </form>
        </div>
      </div>
    </section>
    <hr
          style={{ height: "1px", borderWidth: "0", backgroundColor: "gray" }}
        />
    <Credits />
    </>
  );
};

export default AdminLanding;

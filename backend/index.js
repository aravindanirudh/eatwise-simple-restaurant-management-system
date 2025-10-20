import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
const app = express();

// Code to connect to MySQL database
// If there is an authentication problem, ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aravind2005',
    database: 'restaurant_schema'
});

// Without middleware, you cannot send json in the body of a post request
app.use(express.json());
// Without CORS middleware, you cannot make requests from frontend to backend. You can also specify domain names here like localhost:3000
app.use(cors());

// Basic route to check if backend is running
app.get('/', (req, res) => {
    res.json("Hello this is the backend!");
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const q = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(q, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Return role and user info
        const user = results[0];
        return res.json({ role: user.role, user_id: user.user_id, username: user.username });
    });
});

// Retrieve all users
app.get('/users', (req, res) => {
    const q = "SELECT * FROM users";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json(data);
    });
});

// Delete user by id
app.delete('/users/:id', (req, res) => {
    const user_id = req.params.id;
    const q = "DELETE FROM users WHERE user_id = ?";
    db.query(q, [user_id], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ success: true });
    });
});

// Admin's menu_items management routes
// Retrieve all menu items
app.get('/menu_items', (req, res) => {
    const q = "SELECT * FROM menu_items";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });;
});

// Create new menu item
app.post('/menu_items', (req, res) => {
    const q = "INSERT INTO menu_items (`item_id`, `item_name`, `category`, `price`, `item_picture`) VALUES (?)";
    const values = [req.body.item_id, req.body.item_name, req.body.category, req.body.price, req.body.item_picture];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Menu item created successfully!");
    });
});

// Delete menu item by id
app.delete('/menu_items/:id', (req, res) => {
    const menuItemId = req.params.id;
    const q = "DELETE FROM menu_items WHERE item_id = ?";
    db.query(q, [menuItemId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Menu item deleted successfully!");
    });
})

// Update menu item by id
app.put('/menu_items/:id', (req, res) => {
    const menuItemId = req.params.id;
    const q = "UPDATE menu_items SET `item_name` = ?, `category` = ?, `price` = ?, `item_picture` = ? WHERE item_id = ?";
    const values = [
        req.body.item_name,
        req.body.category,
        req.body.price,
        req.body.item_picture 
    ];
    db.query(q, [...values, menuItemId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Menu item updated successfully!");
    });
})

// Customer/visitor/guest reviews routes
// Rerieve all reviews (for admin)
app.get('/reviews', (req, res) => {
    const q = "SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.user_id";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json(data);
    });
});

// Delete review by id
app.delete('/reviews/:id', (req, res) => {
    const review_id = req.params.id;
    const q = "DELETE FROM reviews WHERE review_id = ?";
    db.query(q, [review_id], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ success: true });
    });
});

// Get a single menu item by id
app.get('/menu_items/:id', (req, res) => {
    const menuItemId = req.params.id;
    const q = "SELECT * FROM menu_items WHERE item_id = ?";
    db.query(q, [menuItemId], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        if (data.length === 0) return res.status(404).json({ error: "Menu item not found" });
        return res.json(data[0]);
    });
});

// Add new review
app.post('/reviews', (req, res) => {
    const { user_id, description, date, rating } = req.body;
    if (!user_id || !description || !date || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const q = "INSERT INTO reviews (user_id, description, date, rating) VALUES (?, ?, ?, ?)";
    db.query(q, [user_id, description, date, rating], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result && result.affectedRows > 0) {
            return res.json({ success: true });
        } else {
            return res.status(500).json({ error: 'Insert failed' });
        }
    });
});

// Add new user
app.post('/users', (req, res) => {
    const { username, password, email, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check for duplicate username
    const checkQ = "SELECT * FROM users WHERE username = ?";
    db.query(checkQ, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        const q = "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
        db.query(q, [username, password, email, role], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result && result.affectedRows > 0) {
                return res.json({ success: true });
            } else {
                return res.status(500).json({ error: 'Insert failed' });
            }
        });
    });
});

// Add order item (creates order if needed)
app.post('/order_items', (req, res) => {
    const { user_id, item_id, quantity, price } = req.body;
    if (!user_id || !item_id || !quantity || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    // Find or create an order for today
    const now = new Date();
    const order_date_time = now.toISOString().slice(0, 19).replace('T', ' ');
    const total_amount = price * quantity;
    // Check if an order exists for this user today
    const findOrderQ = "SELECT order_id FROM orders WHERE user_id = ? AND DATE(order_date_time) = CURDATE()";
    db.query(findOrderQ, [user_id], (err, orders) => {
        if (err) return res.status(500).json({ error: err });
        let order_id;
        if (orders.length > 0) {
            order_id = orders[0].order_id;
            insertOrderItem(order_id);
        } else {
            // Create new order
            const createOrderQ = "INSERT INTO orders (user_id, order_date_time, total_amount) VALUES (?, ?, ?)";
            db.query(createOrderQ, [user_id, order_date_time, total_amount], (err, result) => {
                if (err) return res.status(500).json({ error: err });
                order_id = result.insertId;
                insertOrderItem(order_id);
            });
        }
        function insertOrderItem(order_id) {
            const suborder_price = price * quantity;
            const q = "INSERT INTO order_items (order_id, item_id, quantity, suborder_price) VALUES (?, ?, ?, ?)";
            db.query(q, [order_id, item_id, quantity, suborder_price], (err, data) => {
                if (err) return res.status(500).json({ error: err });
                return res.json({ success: true });
            });
        }
    });
});

// Delete order item
app.delete('/order_items/:id', (req, res) => {
    const order_items_id = req.params.id;
    const q = "DELETE FROM order_items WHERE order_items_id = ?";
    db.query(q, [order_items_id], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ success: true });
    });
});

// Retrieve all orders (for admin)
app.get('/orders', (req, res) => {
    const q = "SELECT * FROM orders";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json(data);
    });
});

// Delete order by id
app.delete('/orders/:id', (req, res) => {
    const order_id = req.params.id;
    const q = "DELETE FROM orders WHERE order_id = ?";
    db.query(q, [order_id], (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ success: true });
    });
});

// Retrieve all order_items (for admin) or for a user
app.get('/order_items', (req, res) => {
    if (req.query.all === 'true') {
        const q = "SELECT order_items_id, order_id, item_id, quantity, suborder_price FROM order_items";
        db.query(q, (err, data) => {
            if (err) return res.status(500).json({ error: err });
            return res.json(data);
        });
    } else if (req.query.user_id) {
        const user_id = req.query.user_id;
        const q = `SELECT oi.order_items_id, oi.order_id, oi.item_id, oi.quantity, oi.suborder_price, mi.item_name
                   FROM order_items oi
                   JOIN orders o ON oi.order_id = o.order_id
                   JOIN menu_items mi ON oi.item_id = mi.item_id
                   WHERE o.user_id = ?`;
        db.query(q, [user_id], (err, data) => {
            if (err) return res.status(500).json({ error: err });
            return res.json(data);
        });
    } else {
        return res.status(400).json({ error: 'Missing query parameter' });
    }
});

// Start the server
app.listen(8800, () => { console.log('Connected to backend!'); });
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State variables for form inputs and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8800/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      localStorage.setItem('user', JSON.stringify(data));
      if (data.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <section className="login-section" id="login-section">
      <div className="glass-container">
        <div className="login-box">
          <h2>Login</h2>
          <p>&#9888; Contact admin for new registration!</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          {/* Display error message in red in case of error */}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default Login;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'admin123') {
      localStorage.setItem('adminPassword', password);
      navigate('/dashboard');
    } else {
      setError('Invalid password. Use: admin123');
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h1>Admin Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoFocus 
              />
            </div>
            <button type="submit" className="btn-primary">Login</button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </>
  );
}

export default Login;


// client/src/components/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth(); // <-- Use the hook
  const [formData, setFormData] = useState({
    username: '',
    departmentName: 'Mountain View Fire Department',
    password: ''
  });

  // ... the rest of the file is exactly the same
  const { username, departmentName, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      login(res.data.token);
    } catch (err) {
      console.error('Login failed:', err.response.data);
    }
  };

  return (
    <div>
      <h2>Employee Portal Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
        </div>
        <div>
          <input type="text" placeholder="Department" name="departmentName" value={departmentName} onChange={onChange} required disabled />
        </div>
        <div>
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
        </div>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginPage;
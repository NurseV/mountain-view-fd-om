// client/src/components/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    departmentName: 'Mountain View Fire Department',
    password: ''
  });

  const { username, departmentName, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login successful!', res.data);
      // In the future, we will save the token and redirect here
    } catch (err) {
      console.error('Login failed:', err.response.data);
    }
  };

  return (
    <div>
      <h2>Employee Portal Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Department"
            name="departmentName"
            value={departmentName}
            onChange={onChange}
            required
            disabled // Disabled as per PRD for initial version [cite: 98]
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginPage;
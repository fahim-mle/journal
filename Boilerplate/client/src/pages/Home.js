import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome to MERN Boilerplate</h1>
      <div className="card">
        <h2>Server Status</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <p>{message}</p>
        )}
      </div>
      <div className="card">
        <h2>Features</h2>
        <ul>
          <li>React 18 with Hooks</li>
          <li>React Router for navigation</li>
          <li>Express.js server</li>
          <li>MongoDB with Mongoose</li>
          <li>JWT Authentication ready</li>
          <li>Security middleware (Helmet, CORS, Rate Limiting)</li>
          <li>Responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
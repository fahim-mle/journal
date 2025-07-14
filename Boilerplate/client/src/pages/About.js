import React from 'react';

const About = () => {
  return (
    <div>
      <h1>About MERN Boilerplate</h1>
      <div className="card">
        <h2>Technology Stack</h2>
        <div className="grid">
          <div>
            <h3>Frontend</h3>
            <ul>
              <li>React 18</li>
              <li>React Router</li>
              <li>Axios for API calls</li>
              <li>CSS3 with Flexbox/Grid</li>
            </ul>
          </div>
          <div>
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>MongoDB with Mongoose</li>
              <li>JWT Authentication</li>
            </ul>
          </div>
          <div>
            <h3>Security</h3>
            <ul>
              <li>Helmet.js</li>
              <li>CORS</li>
              <li>Rate Limiting</li>
              <li>Input Validation</li>
            </ul>
          </div>
          <div>
            <h3>Development</h3>
            <ul>
              <li>Nodemon</li>
              <li>Concurrently</li>
              <li>Environment Variables</li>
              <li>ESLint Ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
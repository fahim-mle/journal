# MERN Stack Boilerplate

A full-stack boilerplate application built with MongoDB, Express.js, React, and Node.js.

## Features

- **Frontend**: React 18 with React Router, Axios for API calls
- **Backend**: Express.js with MongoDB integration
- **Authentication**: JWT-based authentication system
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **Development**: Hot reloading, Environment variables, Concurrent development

## Project Structure

```
mern-boilerplate/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-deps
   ```

3. Set up environment variables:
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern_boilerplate
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

This will start both the React development server (port 3000) and the Express server (port 5000).

## Available Scripts

- `npm run dev` - Run both client and server in development mode
- `npm run client` - Run only the React client
- `npm run server` - Run only the Express server
- `npm run build` - Build the React app for production
- `npm run install-deps` - Install dependencies for both client and server

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (protected)

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **JWT**: Secure authentication
- **Input Validation**: Express-validator
- **Password Hashing**: bcryptjs

## Development

### Client Development
The React app includes:
- Component-based architecture
- React Router for navigation
- Axios for API calls
- Responsive CSS

### Server Development
The Express server includes:
- RESTful API design
- MongoDB integration with Mongoose
- JWT authentication middleware
- Error handling
- Security middleware

## Deployment

1. Build the React app:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Deploy to your preferred hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
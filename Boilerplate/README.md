# MERN Stack Boilerplate

A full-stack boilerplate application built with MongoDB, Express.js, React, and Node.js with Docker containerization.

## Features

- **Frontend**: React 18 with React Router, Axios for API calls
- **Backend**: Express.js with MongoDB integration
- **Authentication**: JWT-based authentication system
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **Development**: Hot reloading, Environment variables, Concurrent development
- **Docker**: Containerized application with Docker Compose
- **Production Ready**: Nginx for frontend, health checks, and service orchestration

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
│   ├── Dockerfile          # Client Docker configuration
│   ├── nginx.conf          # Nginx configuration for production
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── Dockerfile          # Server Docker configuration
│   └── server.js           # Main server file
├── docker-compose.yml      # Docker Compose configuration
├── mongo-init.js           # MongoDB initialization script
├── start.sh                # Application startup script
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Quick Start with Docker (Recommended)

1. Clone the repository
2. Make the start script executable:
   ```bash
   chmod +x start.sh
   ```
3. Run the application:
   ```bash
   ./start.sh
   ```

This will:
- Build and start all services (MongoDB, Backend, Frontend)
- Set up the database with initial configuration
- Start the application on the following ports:
  - Frontend: http://localhost:3000
  - Backend: http://localhost:5000
  - MongoDB: mongodb://localhost:27018

### Manual Docker Setup

If you prefer to run Docker commands manually:

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Stop the application
docker compose down
```

### Traditional Development Setup

For development without Docker:

1. Install dependencies:
   ```bash
   npm run install-deps
   ```

2. Set up environment variables:
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

3. Start MongoDB locally, then run:
   ```bash
   npm run dev
   ```

## Available Scripts

### Docker Commands
- `./start.sh` - Start the complete application with Docker
- `docker compose up --build -d` - Build and start all services
- `docker compose down` - Stop all services
- `docker compose logs -f` - View application logs
- `docker compose restart` - Restart all services

### Development Commands
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

## Docker Services

### MongoDB
- **Container**: `mern_mongodb`
- **Port**: 27018:27017
- **Credentials**: user/your_password
- **Database**: mern_boilerplate
- **Health Check**: Automatic MongoDB ping

### Backend Server
- **Container**: `mern_server`
- **Port**: 5000:5000
- **Environment**: Production
- **Health Check**: HTTP endpoint check

### Frontend Client
- **Container**: `mern_client`
- **Port**: 3000:80
- **Server**: Nginx
- **Health Check**: HTTP endpoint check

## Deployment

### Docker Deployment (Recommended)

1. Ensure Docker is installed on your server
2. Clone the repository
3. Run the start script:
   ```bash
   ./start.sh
   ```
4. Configure environment variables in `docker-compose.yml` for production

### Traditional Deployment

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
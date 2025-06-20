# Smart Home Dashboard Project Log

## Project Overview
This is a MERN (MongoDB, Express, React, Node.js) stack application for monitoring and controlling smart home devices. The project is structured with a clear separation between frontend (client) and backend (server) components.

## Architecture

### Backend (server/)
- **Server Setup**: Running on port 5000 using Express.js
- **Database**: MongoDB with cloud connection (MongoDB Atlas)
- **Authentication**: JWT-based authentication system
- **API Structure**:
  - `/api/auth` - Authentication routes
  - `/api/devices` - Device management routes

### Frontend (client/)
- Built with React + Vite
- Modern tooling setup with ESLint
- Organized component structure in `src/` directory
- Public assets managed in `public/` directory

## Key Features
1. User Authentication & Authorization
2. Interactive Device Dashboard
3. Real-time Device Status Updates
4. Automation Scheduling
5. Energy Usage Monitoring
6. Mobile-responsive Design

## Technical Configuration
- **Backend Port**: 5000
- **Database**: MongoDB Atlas cluster configured
- **Security**: JWT-based authentication implemented
- **API Endpoints**:
  - Authentication endpoints (`/api/auth/*`)
  - Device management endpoints (`/api/devices/*`)

## Project Structure
```
smart-home/
├── client/                  # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── context/        # Context providers
│   │   └── App.jsx         # Main component
├── server/                  # Node.js backend
    ├── controllers/        # Request handlers
    ├── middleware/         # Custom middleware
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── services/          # Business logic
    └── server.js          # Entry point
```

## Dependencies
### Backend Dependencies
- express
- mongoose
- cors
- dotenv
- jsonwebtoken (implied by JWT usage)

### Frontend Dependencies
- React
- React Router
- Styled Components
- Axios

## Development Setup
The project uses modern development practices with:
- Environment-based configuration
- Separate development and production setups
- Vite as the frontend build tool
- ESLint for code quality

## Security Considerations
- JWT-based authentication implemented
- Environment variables properly configured
- Secure MongoDB connection with authentication

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Devices
- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get single device
- `POST /api/devices` - Create a new device
- `PUT /api/devices/:id` - Update a device
- `DELETE /api/devices/:id` - Delete a device

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation Steps
1. Clone the repository
2. Install backend dependencies: `cd server && npm install`
3. Install frontend dependencies: `cd client && npm install`
4. Configure environment variables in `server/config.env`
5. Start backend: `cd server && npm run dev`
6. Start frontend: `cd client && npm run dev`

## License
MIT 
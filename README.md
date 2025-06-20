<<<<<<< HEAD
# Smart-Home
A MERN Stack project for automating smart home devices .
=======
# Smart Home Dashboard

A modern MERN stack application for monitoring and controlling smart home devices. This application features a responsive dashboard for thermostat control, light management, security camera monitoring, energy usage tracking, and environment monitoring.

## Features

- User authentication and authorization
- Interactive dashboard to control smart devices
- Real-time device status updates
- Automation scheduling
- Energy usage monitoring
- Mobile-responsive design

## Tech Stack

- **Frontend**: React, React Router, Styled Components, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
smart-home/
├── client/                  # React frontend
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── context/         # Context providers
│   │   └── App.jsx          # Main application component
│   └── package.json         # Frontend dependencies
├── server/                  # Node.js backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/smart-home.git
   cd smart-home
   ```

2. Install backend dependencies:
   ```
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../client
   npm install
   ```

4. Create a `config.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smarthome
   JWT_SECRET=your_jwt_secret
   ```

### Running the application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd ../client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

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

## License

MIT 
>>>>>>> 70fad00 (Initial commit)
# Smart

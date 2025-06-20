import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import Thermostat from './pages/Thermostat';
import Lighting from './pages/Lighting';
import Security from './pages/Security';
import Devices from './pages/Devices';
import Devanim from './pages/Devanim';
import DevDet from './pages/DevDet';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);

  return (
    <Router>
      <div className="app">
        {isLoggedIn && <Sidebar />}
        <div className="content">
          <Routes>
            <Route path="/Devanim" element={<Devanim />} />

            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route
  path="/devices"
  element={
    <PrivateRoute>
      <Devices />
    </PrivateRoute>
  }
/>
            <Route
  path="/lighting"
  element={
    <PrivateRoute>
      <Lighting />
    </PrivateRoute>
  }
/>
<Route
  path="/security"
  element={
    <PrivateRoute>
      <Security />
    </PrivateRoute>
  }
/>
            <Route 
              path="/settings" 
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              } 
            />
            

       <Route path="/" element={<Devices />} />
      <Route path="/device/:id" element={<DevDet />} />
    
<Route 
  path="/thermostat"
  element={
    <PrivateRoute>
      <Thermostat />
    </PrivateRoute>
  }
/>

            <Route 
              path="/login" 
              element={<Login setIsLoggedIn={setIsLoggedIn} />} 
            />
            <Route 
              path="/register" 
              element={<Register setIsLoggedIn={setIsLoggedIn} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

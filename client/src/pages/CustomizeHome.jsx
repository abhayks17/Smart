import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CustomizeHome() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch locations on mount
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Could not fetch locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Add new location
  const handleAddLocation = async () => {
    const trimmedLocation = newLocation.trim();
    if (!trimmedLocation) {
      setError("Location name cannot be empty.");
      return;
    }
    if (trimmedLocation.length > 50) {
      setError("Location name must be 50 characters or less.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await axios.post("http://localhost:5000/api/locations", {
        name: trimmedLocation,
      });
      setNewLocation("");
      fetchLocations(); // Refresh the list
    } catch (err) {
      console.error("Error adding location:", err);
      setError("Could not add location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, background: "#222", borderRadius: 8, color: "white" }}>
      <h2>Customize Home</h2>
      <p>Add rooms or locations to your smart home setup.</p>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          value={newLocation}
          onChange={e => setNewLocation(e.target.value)}
          placeholder="Enter new location (e.g., Living Room)"
          aria-label="New location name"
          style={{
            padding: 8,
            borderRadius: 4,
            border: "none",
            marginRight: 10,
            width: 250,
          }}
          disabled={loading}
        />
        <button
          onClick={handleAddLocation}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: loading ? "#aaa" : "#1976d2",
            border: "none",
            borderRadius: 4,
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Adding..." : "Add Location"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 10 }} role="alert">
          {error}
        </p>
      )}

      <div style={{ marginTop: 30 }}>
        <h3>Existing Locations:</h3>
        {loading ? (
          <p>Loading...</p>
        ) : locations.length === 0 ? (
          <p>No locations added yet.</p>
        ) : (
          <ul>
            {locations.map(loc => (
              <li key={loc._id || loc.name}>{loc.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
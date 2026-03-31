import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CurrentWeather from "./pages/CurrentWeather";
import HistoricalWeather from "./pages/HistoricalWeather";
import "./App.css";

const AppContent = () => {
  const [coords, setCoords] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      });
    });
  }, []);

  if (!coords) return <h2>Loading location...</h2>;

  return (
    <>
      {/* 🌐 NAVBAR */}
      <div className="navbar">
        <div className="navbar-title">🌤 AtmosTrack</div>

        <div className="navbar-links">
          <button onClick={() => navigate("/")}>Current</button>
          <button onClick={() => navigate("/historical")}>Historical</button>
        </div>
      </div>

      {/* 🌍 ROUTES */}
      <Routes>
        <Route path="/" element={<CurrentWeather coords={coords} />} />
        <Route path="/historical" element={<HistoricalWeather coords={coords} />} />
      </Routes>

      {/* 🔻 FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} Nikhil Pol. All rights reserved.
      </footer>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
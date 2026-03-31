import React, { useEffect, useState } from "react"; // CurrentWeather
import { getWeatherData, getAirQuality } from "../services/weatherService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ChartComponent from "../components/ChartComponent";
import { WiThermometer, WiHumidity, WiStrongWind, WiSunrise } from "react-icons/wi";
import { FaSmog } from "react-icons/fa";

const CurrentWeather = ({ coords }) => {
  const [data, setData] = useState(null);
  const [air, setAir] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredIndex, setFilteredIndex] = useState(0);
  const [displayDate, setDisplayDate] = useState(new Date());

  const [showPopup, setShowPopup] = useState(false);

  // ✅ THEME FUNCTION
  const getWeatherTheme = () => {
    if (!data) return "sunny";

    const temp = data.current_weather.temperature;
    const rain = data.hourly.precipitation[0];
    const wind = data.current_weather.windspeed;

    if (rain > 2) return "rainy";
    if (temp < 15) return "cold";
    if (wind > 20) return "windy";

    return "sunny";
  };

  // ✅ Fetch Data
  useEffect(() => {
    if (!coords) return;

    const fetchData = async () => {
      try {
        const weather = await getWeatherData(coords.lat, coords.lon);
        const airData = await getAirQuality(coords.lat, coords.lon);

        setData(weather);
        setAir(airData);

        const firstDate = weather.daily.time[0];

        setFilteredIndex(0);
        setDisplayDate(new Date(firstDate));
        setSelectedDate(new Date(firstDate));

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [coords]);

  const handleApplyDate = () => {
    if (!data) return;

    const selected = selectedDate.toISOString().split("T")[0];
    const index = data.daily.time.findIndex((d) => d === selected);

    if (index !== -1) {
      setFilteredIndex(index);
      setDisplayDate(selectedDate);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

    } else {
      alert("❌ No data available for this date.");
    }
  };

  if (!data || !air) return <h3>Loading...</h3>;

  const daily = data.daily;
  const current = data.current_weather;

  const selectedDateStr = displayDate.toISOString().split("T")[0];

  const filteredHourly = data.hourly.time
    .map((t, i) => ({
      time: t,
      value: data.hourly.temperature_2m[i]
    }))
    .filter((item) => item.time.startsWith(selectedDateStr));

  return (
    <div className={`main-ui ${getWeatherTheme()}`}>

      {/* ✅ NAVBAR ADDED (ONLY UI) */}
     <div className="navbar-title">
  <span>🌤</span> AtmosTrack
</div>
<h1
  style={{
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}
>
  Weather Dashboard
</h1>
      <h2>🌤 Current Weather</h2>

      {showPopup && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          fontWeight: "bold"
        }}>
          ✅ Data loaded for {displayDate.toLocaleDateString()}
        </div>
      )}

      <p>
        📅 Data for date: <strong>{displayDate.toLocaleDateString()}</strong>
      </p>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date(daily.time[0])}
        maxDate={new Date(daily.time[daily.time.length - 1])}
      />

      <button onClick={handleApplyDate}>Apply Date</button>

      <div className="section">
        <h3><WiThermometer /> Temperature</h3>
        <p>Current: {current.temperature}°C</p>
        <p>Max: {daily.temperature_2m_max[filteredIndex]}°C</p>
        <p>Min: {daily.temperature_2m_min[filteredIndex]}°C</p>
      </div>

      <div className="section">
        <h3><WiHumidity /> Atmospheric Conditions</h3>
        <p>Precipitation: {data.hourly.precipitation[filteredIndex]}</p>
        <p>Humidity: {data.hourly.relativehumidity_2m[filteredIndex]}%</p>
        <p>UV Index: {daily.uv_index_max[filteredIndex]}</p>
      </div>

      <div className="section">
        <h3><WiSunrise /> Sun Cycle</h3>
        <p>Sunrise: {daily.sunrise[filteredIndex]}</p>
        <p>Sunset: {daily.sunset[filteredIndex]}</p>
      </div>

      <div className="section">
        <h3><WiStrongWind /> Wind & Air</h3>
        <p>Max Wind Speed: {daily.windspeed_10m_max[filteredIndex]} km/h</p>
        <p>
          Precipitation Probability:{" "}
          {daily.precipitation_probability_max[filteredIndex]}%
        </p>
      </div>

      <div className="section">
        <h3><FaSmog /> Air Quality</h3>
        <p>AQI: {air.hourly.us_aqi[filteredIndex]}</p>
        <p>PM10: {air.hourly.pm10[filteredIndex]}</p>
        <p>PM2.5: {air.hourly.pm2_5[filteredIndex]}</p>
        <p>CO: {air.hourly.carbon_monoxide[filteredIndex]}</p>
        <p>NO2: {air.hourly.nitrogen_dioxide[filteredIndex]}</p>
        <p>SO2: {air.hourly.sulphur_dioxide[filteredIndex]}</p>
      </div>

      <h3>Temperature (Selected Date)</h3>

      {filteredHourly.length > 0 ? (
        <ChartComponent title="Temperature" data={filteredHourly} />
      ) : (
        <p>❌ No hourly data available for this date</p>
      )}
    </div>
  );
};

export default CurrentWeather;
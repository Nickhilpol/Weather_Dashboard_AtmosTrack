import React, { useState } from "react";// HistoricalWeather
import {
  getHistoricalData,
  getHistoricalAirQuality
} from "../services/weatherService";
import ChartComponent from "../components/ChartComponent";

const HistoricalWeather = ({ coords }) => {
  const [year, setYear] = useState("2024");
  const [data, setData] = useState(null);
  const [air, setAir] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("line");
  const [showPopup, setShowPopup] = useState(false);

  const reduceData = (data, step = 5) => {
    return data.filter((_, i) => i % step === 0);
  };

  // ✅ THEME LOGIC (FIXED POSITION)
  const getHistoricalTheme = () => {
    if (!data) return "sunny";

    const avgTemp =
      data.daily.temperature_2m_mean.reduce((a, b) => a + b, 0) /
      data.daily.temperature_2m_mean.length;

    const maxRain = Math.max(...data.daily.precipitation_sum);
    const maxWind = Math.max(...data.daily.windspeed_10m_max);

    const avgPM25 = air
      ? air.hourly.pm2_5.reduce((a, b) => a + b, 0) /
        air.hourly.pm2_5.length
      : 0;

    if (avgPM25 > 80) return "polluted";  // 🌫 POLLUTED → Dark Purple/Gray 
    if (maxRain > 50) return "rainy"; // 🌧 RAINY → Blue Gradient
    if (avgTemp < 15) return "cold";   // ❄ COLD → Light Blue
    if (maxWind > 30) return "windy"; // 🌬 WINDY → Gray/Dark

    return "sunny";
  };

  const fetchData = async () => {
    if (!coords) return;

    setLoading(true);
    setError("");

    try {
      const start = `${year}-01-01`;
      const end = `${year}-12-31`;

      const [weatherRes, airRes] = await Promise.all([
        getHistoricalData(coords.lat, coords.lon, start, end),
        getHistoricalAirQuality(coords.lat, coords.lon, start, end)
      ]);

      setData(weatherRes);
      setAir(airRes);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

    } catch (err) {
      setError("❌ Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`main-ui ${getHistoricalTheme()}`}>

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
      
      <h2>📊 Historical Weather</h2>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontWeight: "bold"
          }}
        >
          ✅ Data loaded for year {year}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <label>Year: </label>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <button onClick={fetchData}>Load Data</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Graph Type: </label>
        <select onChange={(e) => setChartType(e.target.value)}>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
      </div>

      {loading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && !loading && (
        <>
          <ChartComponent
            title="Temperature Mean"
            type={chartType}
            data={reduceData(
              data.daily.time.map((t, i) => ({
                time: t,
                value: data.daily.temperature_2m_mean[i]
              }))
            )}
          />

          <ChartComponent
            title="Temperature Max"
            type={chartType}
            data={reduceData(
              data.daily.time.map((t, i) => ({
                time: t,
                value: data.daily.temperature_2m_max[i]
              }))
            )}
          />

          <ChartComponent
            title="Temperature Min"
            type={chartType}
            data={reduceData(
              data.daily.time.map((t, i) => ({
                time: t,
                value: data.daily.temperature_2m_min[i]
              }))
            )}
          />

          <ChartComponent
            title="Sunrise (IST)"
            type={chartType}
            data={reduceData(
              data.daily.time.map((t, i) => ({
                time: t,
                value: new Date(data.daily.sunrise[i]).getHours()
              }))
            )}
          />

          <ChartComponent
            title="Sunset (IST)"
            type={chartType}
            data={reduceData(
              data.daily.time.map((t, i) => ({
                time: t,
                value: new Date(data.daily.sunset[i]).getHours()
              }))
            )}
          />

          <ChartComponent
            title="Precipitation"
            type={chartType}
            data={reduceData(
              data.daily.time.map((t, i) => ({
                time: t,
                value: data.daily.precipitation_sum[i]
              }))
            )}
          />

          <ChartComponent
            title="Wind Speed"
            type={chartType}
            data={reduceData(
              data.daily.time.map((t, i) => ({
                time: t,
                value: data.daily.windspeed_10m_max[i]
              }))
            )}
          />

          {air && (
            <ChartComponent
              title="PM10 & PM2.5 Trends"
              type={chartType}
              data={reduceData(
                air.hourly.time.map((t, i) => ({
                  time: t,
                  pm10: air.hourly.pm10[i],
                  pm25: air.hourly.pm2_5[i]
                }))
              )}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HistoricalWeather;
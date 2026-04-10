import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

// ✅ Cache for performance
const cache = {};

const getKey = (lat, lon) => `${lat}-${lon}`;


export const getWeatherData = async (lat, lon) => {
  const key = getKey(lat, lon);

  if (cache[key]) {
    console.log("Using cached current weather");
    return cache[key];
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: [
          "temperature_2m",
          "relativehumidity_2m",
          "precipitation",
          "visibility",
          "windspeed_10m",
          "pm10",
          "pm2_5"
        ],
        daily: [
          "temperature_2m_max",
          "temperature_2m_min",
          "sunrise",
          "sunset",
          "uv_index_max",
          "precipitation_probability_max",
          "windspeed_10m_max"
        ],
        current_weather: true,
        timezone: "auto"
      }
    });

    cache[key] = response.data;

    return response.data;

  } catch (error) {
    console.error("Current Weather API Error:", error);
    throw error;
  }
};

export const getHistoricalData = async (lat, lon, start, end) => {
  try {
    const response = await axios.get(
      "https://archive-api.open-meteo.com/v1/archive",
      {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: start,
          end_date: end,
          daily: [
            "temperature_2m_max",
            "temperature_2m_min",
            "temperature_2m_mean",
            "precipitation_sum",
            "windspeed_10m_max",
            "winddirection_10m_dominant",
            "sunrise",
            "sunset"
          ],
          timezone: "auto"
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("Historical Weather API Error:", error);
    throw error;
  }
};

export const getAirQuality = async (lat, lon) => {
  try {
    const response = await axios.get(
      "https://air-quality-api.open-meteo.com/v1/air-quality",
      {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: [
            "pm10",
            "pm2_5",
            "carbon_monoxide",
            "nitrogen_dioxide",
            "sulphur_dioxide",
            "ozone",
            "us_aqi"
          ],
          timezone: "auto"
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("Air Quality API Error:", error);
    throw error;
  }
};

export const getHistoricalAirQuality = async (lat, lon, start, end) => {
  try {
    const res = await axios.get(
      "https://air-quality-api.open-meteo.com/v1/air-quality",
      {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: start,
          end_date: end,
          hourly: ["pm10", "pm2_5"],
          timezone: "auto"
        }
      }
    );

    return res.data;

  } catch (err) {
    console.error("Air Quality Historical Error:", err);
    throw err;
  }
};

import React, { useState, useEffect } from "react";
import { fetchForecastData, fetchWeatherData } from "../services/weatherService";
import "./WeatherComponent.css";

// Icon Set 1
import clear_icon from "../assets/icons/clear.png";
import cloud_icon from "../assets/icons/cloud.png";
import drizzle_icon from "../assets/icons/drizzle.png";
import snow_icon from "../assets/icons/snow.png";
import rain_icon from "../assets/icons/rain.png";

// Icon Set 2
import clear_day_icon from "../assets/icons/clearday.png";
import clear_night_icon from "../assets/icons/clearnight.png";
import cloudy_day_icon from "../assets/icons/cloudyday.png";
import cloudy_night_icon from "../assets/icons/cloudynight.png";
import rainy_icon from "../assets/icons/rainy.png";
import drizzly_icon from "../assets/icons/drizzly.png";
import snowy_icon from "../assets/icons/snowy.png";
import misty_day_icon from "../assets/icons/mistyday.png";
import misty_night_icon from "../assets/icons/mistynight.png";

// Air Condition Icons
import wind_icon from "../assets/icons/wind.png";
import humidity_icon from "../assets/icons/humidity.png";

const WeatherComponent = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [currentDate, setCurrentDate] = useState({ day: "", date: "" });

  const icons = {
    "01d": clear_day_icon, // Clear Sky Day
    "01n": clear_night_icon, // Clear Sky Night
    "02d": cloudy_day_icon, // Few Clouds Day
    "02n": cloudy_night_icon, // Few Clouds Night
    "03d": cloudy_day_icon, // Scattered Clouds Day
    "03n": cloudy_night_icon, // Scattered Clouds Night
    "04d": cloudy_day_icon, // Broken Clouds Day
    "04n": cloudy_night_icon, // Broken Clouds Night
    "09d": drizzly_icon, // Shower Rain Day
    "09n": drizzly_icon, // Shower Rain Night
    "10d": rainy_icon, // Rain Day
    "10n": rainy_icon, // Rain Night
    "11d": rainy_icon, // Thunderstorm Day
    "11n": rainy_icon, // Thunderstorm Night
    "13d": snowy_icon, // Snow Day
    "13n": snowy_icon, // Snow Night
    "50d": misty_day_icon, // Mist Day
    "50n": misty_night_icon, // Mist Night
  };

  useEffect(() => {
    if (weatherData) {
      const { timezone } = weatherData;
      const cityTime = new Date();
      const localTime = cityTime.getTime();
      const cityTimeZoneOffset = timezone * 1000;
      const adjustedTime = localTime + cityTimeZoneOffset;

      const adjustedDate = new Date(adjustedTime);
      const day = adjustedDate.toLocaleDateString('en-US', {weekday: 'long'});
      const date = adjustedDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'});

      setCurrentDate({day, date})
    }
  }, [weatherData])

  // Changes the state of the location variable as input changes
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  // Converts Kelvin to Celsius
  const kelvinToCelsius = (kelvin) => Math.floor(kelvin - 273);

  // Converts UTC to Local Time
  const convertToLocalTime = (dt_txt, timezoneOffset) => {
    const utcDate = new Date(dt_txt);

    const localTime = new Date(utcDate.getTime() + timezoneOffset * 1000);

    const timeString = localTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return timeString;
  };

  // Handles search
  const search = async (event) => {
    event.preventDefault();
    if (location.trim() !== "") {
      try {
        const weather = await fetchWeatherData(location);
        if (!weather) {
          return;
        }
        const forecast = await fetchForecastData(location);
        const wData = weather.data;
        const fData = forecast.data;
        setWeatherData({
          temperature: kelvinToCelsius(wData.main.temp), 
          condition: wData.weather[0].main,
          windSpeed: wData.wind.speed,
          humidity: wData.main.humidity,
          location: wData.name,
          icon: wData.weather[0].icon,
          timezone: wData.timezone
        });
        setForecastData(fData.list.slice(0, 8));
        setLocation("");
      }
      catch (error) {
        if (error.message.includes("City not found")) {
          alert("City not found. Please enter a valid city.");
        }
        else {
          alert("Error fetching weather data. Please try again.")
        }
      }
    }
  };

  return (
    <div className="weather-container">
      {!weatherData && <h2>Weather App</h2>}
      <form onSubmit={search} className="weather-form">
        <input
          type="text"
          placeholder="Enter City"
          value={location}
          onChange={handleLocationChange}
        />
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
      {weatherData && (
        <div className="weather-content">
          <img src={icons[weatherData.icon] || clear_day_icon} alt="Weather Icon" />
          <h3>{weatherData.location}</h3>
          {currentDate.day && currentDate.date && (
                <p>{currentDate.day} | {currentDate.date}</p>
              )}
          <h4>&nbsp;{weatherData.temperature}°</h4>
          <p>{weatherData.condition}</p>
          {forecastData.length > 0 && (
            <div className="forecast-container">
              <div className="forecast-item-container">
                {forecastData.map((timeframe, index) => (
                  <div key={index} className="forecast-item">
                    <p>{convertToLocalTime(timeframe.dt_txt, weatherData.timezone)}</p>
                    <img src={icons[timeframe.weather[0].icon]} alt="" />
                    <p>{`${kelvinToCelsius(timeframe.main.temp)}°C`}</p>
                  </div>
                  ))}
              </div>
            </div>
          )}
          <hr />
          <div className="air-conditions-content">
            <div className="air-condition">
              <img src={wind_icon} alt="Humidity Icon" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <p>Wind</p>
              </div>
            </div>
            <div className="air-condition">
              <img src={humidity_icon} alt="Humidity Icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
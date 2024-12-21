import React, { useState, useEffect } from "react";
import {
  fetchForecastData,
  fetchWeatherData,
} from "../services/weatherService";
import "./WeatherComponent.css";

// Icon Set
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
      const { timezone, dt } = weatherData;

      const adjustedDate = new Date((dt + timezone) * 1000);

      const day = adjustedDate.toLocaleDateString("en-US", { weekday: "long" });
      const date = adjustedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });

      setCurrentDate({ day, date });
    }
  }, [weatherData]);

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

    const timeString = localTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
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
          timezone: wData.timezone,
          dt: wData.dt,
        });
        setForecastData(fData.list.slice(0, 8));
        setLocation("");
      } catch (error) {
        if (error.message.includes("City not found")) {
          alert("City not found. Please enter a valid city.");
        } else {
          alert("Error fetching weather data. Please try again.");
        }
      }
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center">
      {!weatherData && (
        <h2 className="text-2xl text-white mb-3 font-bold">Weather App</h2>
      )}
      <form
        onSubmit={search}
        className="flex justify-evenly items-center w-3/4 pt-10"
      >
        <input
          className="h-12 w-3/4 rounded-2xl border-none text-xl px-2 shadow-md shadow-black/75"
          type="text"
          placeholder="Enter City"
          value={location}
          onChange={handleLocationChange}
        />
        <button
          type="submit"
          className="h-12 w-12 text-xl text-black border-none rounded-full bg-white cursor-pointer shadow-md shadow-black/75 transition-colors duration-500 ease-in-out hover:bg-white/70"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
      {weatherData && (
        <div className="flex flex-col items-center flex-1 justify-around mb-5 mt-3">
          <img
            className="w-1/2"
            src={icons[weatherData.icon] || clear_day_icon}
            alt="Weather Icon"
          />
          <div className="flex flex-col justify-center items-center h-[9rem] w-full gap-1">
            <h3 className="text-white text-4xl font-bold">
              {weatherData.location}
            </h3>
            {currentDate.day && currentDate.date && (
              <p className="text-white text-lg">
                {currentDate.day} | {currentDate.date}
              </p>
            )}
            <h4 className="text-white text-4xl">
              &nbsp;{weatherData.temperature}°
            </h4>
            <p className="text-white text-lg">{weatherData.condition}</p>
          </div>
          {forecastData.length > 0 && (
            <div className="forecast-item-container flex w-[28.125rem] overflow-x-auto pb-4 mt-3">
              {forecastData.map((timeframe, index) => (
                <div key={index} className="flex flex-col items-center justify-center bg-white/10 mx-2.5 w-[6.25rem] h-[8rem] p-2 flex-shrink-0 rounded-2xl shadow-md shadow-black/75 transition-color duration-500 ease-in-out hover:bg-white/20">
                  <p className="text-lg m-0 text-white"> 
                    {convertToLocalTime(
                      timeframe.dt_txt,
                      weatherData.timezone
                    )}
                  </p>
                  <img className="w-auto h-16 object-contain" src={icons[timeframe.weather[0].icon]} alt="" />
                  <p className="text-lg m-0 text-white">{`${kelvinToCelsius(timeframe.main.temp)}°C`}</p>
                </div>
              ))}
            </div>
          )}
          <hr className="w-3/4 m-2"/>
          <div className="flex justify-between w-3/4">
            <div className="flex items-center my-3">
              <img className="w-12 m-3" src={wind_icon} alt="Humidity Icon" />
              <div>
                <p className="text-lg my-1/2 text-white">{weatherData.windSpeed} m/s</p>
                <p className="text-lg my-1/2 text-white">Wind</p>
              </div>
            </div>
            <div className="flex items-center my-3">
              <img
                className="w-12 m-3"
                src={humidity_icon}
                alt="Humidity Icon"
              />
              <div>
                <p className="text-lg my-1/2 text-white">{weatherData.humidity}%</p>
                <p className="text-lg my-1/2 text-white">Humidity</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;

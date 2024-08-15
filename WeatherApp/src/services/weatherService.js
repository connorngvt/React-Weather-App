import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

export const fetchWeatherData = async (city) => {
    try {
      const url = `${BASE_URL}weather?q=${city}&appid=${API_KEY}`;
      const response = await axios.get(url);
      console.log(response);
      return response;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error("City not found. Please enter a valid city.");
        } else {
          throw new Error("Error fetching weather data. Please try again.");
        }
      } else {
        throw new Error("Error fetching weather data. Please try again.");
      }
    }
  };
  
  export const fetchForecastData = async (city) => {
    try {
      const url = `${BASE_URL}forecast?q=${city}&appid=${API_KEY}`;
      const response = await axios.get(url);
      console.log(response);
      return response;
    } catch (error) {
      throw new Error("Error fetching forecast data. Please try again.");
    }
  };
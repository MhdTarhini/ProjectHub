import React, { useState, useEffect } from "react";
import "./weather.css";
import Clock from "react-live-clock";

const API_KEY = "913693fccf5e0b46fcfeb08e50f8a074";

function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Lebanon");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isDaytime, setIsDaytime] = useState(true);

  const getBackgroundImage = () => {
    if (!weatherData) return "url('/path-to-default-image.jpg')";

    switch (weatherData.weather[0].main.toLowerCase()) {
      case "clear":
        return "https://i.pinimg.com/originals/50/91/3f/50913f55eff4ab525254dc709eef9e06.gif";
      case "rain":
        return "https://dynamicpowerpoint.com/wp-content/uploads/2022/02/thunder-full-hd-weather-icon-sample.gif";
      case "clouds":
        return "https://cdn.dribbble.com/users/199340/screenshots/2146880/cloudy-sunny-800x600.gif";
      default:
        return "https://i.pinimg.com/originals/50/91/3f/50913f55eff4ab525254dc709eef9e06.gif";
    }
  };

  const widgetStyle = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.5)), url(${getBackgroundImage()})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  useEffect(() => {
    const date = new Date();
    const options = { month: "long", day: "numeric" };
    setCurrentDate(date.toLocaleDateString("en-US", options));

    const hours = date.getHours();
    setCurrentTime(
      `${hours.toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );

    setIsDaytime(hours > 6 && hours < 18);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }, [city]);

  return (
    <div className="weather-widget" style={widgetStyle}>
      {weatherData && (
        <div>
          <h2>{currentDate}</h2>
          <small className="date"></small>
          <div className="time">
            <Clock format={"HH:mm"} ticking={true} timezone={"lb"} />
          </div>
          <p>{weatherData.weather[0].description}</p>
          <p>{weatherData.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;

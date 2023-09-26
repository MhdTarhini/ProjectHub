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
    <>
      {weatherData && (
        <div class="container mx-autos">
          <div class="w-80 h-full">
            <div class="bg-white p-6 rounded-2xl border-2 border-gray-50">
              <div class="flex flex-col">
                <div>
                  <h2 class="font-bold text-gray-600 text-center">
                    Beirut, {weatherData.name}
                  </h2>
                </div>
                <div class="my-6">
                  <div class="flex flex-row space-x-4 items-center">
                    <div id="icon">
                      <span>
                        <svg
                          class="w-20 h-20 fill-stroke text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      </span>
                    </div>
                    <div id="temp">
                      <h4 class="text-4xl">{weatherData.main.temp}°C</h4>
                      <p class="text-xs text-gray-500">
                        {weatherData.weather[0].description}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="w-full place-items-end text-right border-t-2 border-gray-100 mt-2">
                  <a href="#" class="text-indigo-600 font-medium">
                    <Clock format={"HH:mm"} ticking={true} timezone={"lb"} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WeatherWidget;





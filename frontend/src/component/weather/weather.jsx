import React, { useState, useEffect } from "react";
import "./weather.css";
import Clock from "react-live-clock";

const API_KEY = "913693fccf5e0b46fcfeb08e50f8a074";

function WeatherWidget() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Beirut,Lebanon");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isDaytime, setIsDaytime] = useState(true);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    if (
      weatherData &&
      weatherData.weather[0].main.toLowerCase().includes("clouds")
    ) {
      setSvg("http://127.0.0.1:8000/uploads/assets/clouds.svg");
    }
    if (
      weatherData &&
      weatherData.weather[0].main.toLowerCase().includes("rain")
    ) {
      setSvg("http://127.0.0.1:8000/uploads/assets/rain.svg");
    }
    if (
      weatherData &&
      weatherData.weather[0].main.toLowerCase().includes("clear")
    ) {
      setSvg("http://127.0.0.1:8000/uploads/assets/sun.svg");
    }
  }, [weatherData]);

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
            <div class=" p-6 rounded-2xl">
              <div class="flex flex-col">
                <div>
                  <h2 class="font-bold text-gray-600 text-center city">
                    {weatherData.name}, Lebanon
                  </h2>
                </div>
                <div class="mt-3">
                  <div class="flex flex-row space-x-4 class-weather">
                    <div id="icon">
                      <span>
                        <img src={svg} alt="" srcset="" />
                      </span>
                    </div>
                    <div id="temp">
                      <h4 class="text-4xl">{weatherData.main.temp}°C</h4>
                      <p class=" weather">
                        {weatherData.weather[0].description}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="w-full place-items-end text-right border-t-2 border-gray-100 mt-5">
                  <div href="#" class="text-indigo-600 font-medium">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}>
                      <div>{currentDate}</div>
                      {currentTime}
                    </div>
                  </div>
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





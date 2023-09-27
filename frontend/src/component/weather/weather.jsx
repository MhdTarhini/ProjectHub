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
  const [svg, setSvg] = useState("");

  useEffect(() => {
    if (
      weatherData &&
      weatherData.weather[0].main.toLowerCase().includes("clouds")
    ) {
      setSvg("./clouds.svg");
    }
    if (
      weatherData &&
      weatherData.weather[0].main.toLowerCase().includes("rain")
    ) {
      setSvg("./rain.svg");
    }
    if (
      weatherData &&
      weatherData.weather[0].main.toLowerCase().includes("clear")
    ) {
      setSvg("./sun.svg");
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
                        <img src={svg} alt="" srcset="" />
                      </span>
                    </div>
                    <div id="temp">
                      <h4 class="text-4xl">{weatherData.main.temp}°C</h4>
                      <p class="">{weatherData.weather[0].description}</p>
                    </div>
                  </div>
                </div>
                <div class="w-full place-items-end text-right border-t-2 border-gray-100 mt-2">
                  <a href="#" class="text-indigo-600 font-medium">
                    {/* <Clock format={"HH:mm"} ticking={true} timezone={"LB"} /> */}
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





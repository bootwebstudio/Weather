import { useState } from "react";
import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import axios from "axios";

// Assets
import Rain from "../assets/Weather/Rain.png";
import Snow from "../assets/Weather/Snow.png";
import Shine from "../assets/Weather/Shine.png";
import Cloud from "../assets/Weather/Cloud.png";
import Storm from "../assets/Weather/Storm.png";
import LocationImage from "../assets/Location.png";

const API_KEY = "7c4cc4773a9f4d198b420252250306";

const Weather = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getWeatherIcon = (condition) => {
    const text = condition.toLowerCase();
    if (text.includes("rain")) return Rain;
    if (text.includes("snow")) return Snow;
    if (text.includes("storm") || text.includes("thunder")) return Storm;
    if (text.includes("cloud")) return Cloud;
    return Shine;
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`
      );
      setWeatherData(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data for your location.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherBgColor = (condition) => {
    const text = condition.toLowerCase();

    if (text.includes("sunny") || text.includes("clear")) {
      return "bg-gradient-to-br from-yellow-100 to-yellow-300"; // Sunny
    }
    if (text.includes("rain")) {
      return "bg-gradient-to-br from-blue-100 to-blue-300"; // Rain
    }
    if (text.includes("snow")) {
      return "bg-gradient-to-br from-blue-50 to-blue-100"; // Snow
    }
    if (text.includes("storm") || text.includes("thunder")) {
      return "bg-gradient-to-br from-gray-300 to-gray-500"; // Storm
    }
    if (text.includes("cloud")) {
      return "bg-gradient-to-br from-gray-100 to-gray-300"; // Cloudy
    }
    if (text.includes("fog") || text.includes("mist")) {
      return "bg-gradient-to-br from-gray-100 to-gray-200"; // Fog/Mist
    }
    return "bg-gradient-to-br from-blue-100 to-blue-200"; // Default
  };

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
      );
      setWeatherData(res.data);
      setError(null);
    } catch (err) {
      setError("City not found. Please try another location.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setLocation(coords);
          fetchWeatherByCoords(coords.lat, coords.lon);
        },
        (err) => {
          setError("Location access denied. Please search for a city instead.");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      fetchWeatherByCity(searchQuery);
    }
  };

  const current = weatherData?.current;
  const forecastDays = weatherData?.forecast?.forecastday;

  return (
    <div className="w-full min-h-screen p-6 xl:p-8 xl:px-12 flex flex-col gap-8 items-center xl:items-start font-[Quicksand]">
      {/* Search Bar */}
      <div className="w-full p-2 text-lg font-semibold flex gap-2 justify-between items-center rounded-full border-2 border-blue-400 overflow-hidden">
        <input
          type="text"
          placeholder="Search city (Ex. Patna)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="w-full p-2 px-2.5 border-none outline-none text-blue-400 placeholder-blue-400"
        />
        <div
          onClick={handleSearch}
          className="p-2 px-3.5 rounded-full text-white bg-blue-400 cursor-pointer hover:bg-blue-500 transition-colors"
        >
          <i className="ri-search-line"></i>
        </div>
      </div>

      {/* Weather Data */}
      {!loading && weatherData && (
        <div className="w-full flex flex-col xl:flex-row gap-16">
          <div className="w-full xl:w-1/2 xl:h-full flex flex-col gap-8 items-center justify-between">
            {/* Weather Overview */}
            <div className="w-full p-4 xl:p-6 rounded-xl text-blue-800 bg-blue-100 flex flex-col gap-8 xl:gap-16">
              {/* Top Bar */}
              <div className="flex justify-between">
                <div className="text-lg xl:text-xl font-semibold flex gap-2">
                  <i className="ri-map-pin-line"></i>
                  <span>{weatherData.location.name}</span>
                </div>
                <span className="text-lg xl:text-xl font-semibold">
                  {new Date().toLocaleString("en-US", {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Temperature & Condition */}
              <div className="flex flex-col items-center gap-2.5 xl:gap-4">
                <h2 className="text-6xl xl:text-8xl font-extrabold">
                  {current.temp_c}°C
                </h2>
                <span className="text-lg xl:text-xl font-semibold">
                  {current.condition.text}
                </span>

                <div className="w-full flex justify-between text-lg xl:text-xl font-semibold">
                  <span>
                    <i className="ri-windy-line"></i> {current.wind_kph} km/h
                  </span>
                  <span>
                    <i className="ri-drop-line"></i> {current.humidity}%
                  </span>
                  <span>
                    <i className="ri-cloud-windy-line"></i>{" "}
                    {current.pressure_mb} hPa
                  </span>
                </div>
              </div>
            </div>
            {/* Hourly Forecast */}
            <div className="w-full flex flex-col gap-4">
              <span className="text-lg xl:text-xl font-semibold">
                Hourly Temperature
              </span>

              <div className="w-full relative">
                <div className="flex gap-6 xl:gap-12 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
                  {forecastDays?.[0]?.hour.map((hour, idx) => (
                    <div
                      key={idx}
                      className="flex gap-1.5 xl:gap-4 flex-col items-center text-sm xl:text-base font-semibold min-w-[48px] flex-shrink-0"
                    >
                      <span className="text-stone-600">
                        {new Date(hour.time).getHours()}:00
                      </span>
                      <img
                        src={getWeatherIcon(hour.condition.text)}
                        alt={hour.condition.text}
                        className="w-10 xl:w-16"
                      />
                      <span>{hour.temp_c}°C</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Weather Report */}
          <div className="w-full xl:w-1/2 flex flex-col gap-8 items-center">
            {/* Temperature Chart */}
            <div className="w-full p-4 bg-blue-100 rounded-xl">
              <div className="text-lg xl:text-xl font-semibold mb-4">
                Today's Temperature Trend
              </div>

              {forecastDays?.[0]?.hour?.length > 0 ? (
                <div className="w-full h-24 xl:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={forecastDays[0].hour.map((h) => ({
                        time: `${new Date(h.time).getHours()}:00`,
                        temp: h.temp_c,
                      }))}
                      margin={{ top: 10, bottom: 20, left: 10, right: 10 }}
                    >
                      <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#4F8DFD"
                        strokeWidth={2}
                        dot={{
                          r: 3,
                          fill: "#4F8DFD",
                          stroke: "#fff",
                          strokeWidth: 1,
                        }}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-stone-500">
                  Loading temperature trend...
                </div>
              )}
            </div>

            {/* 3-Day Forecast */}
            <div className="w-full flex flex-col gap-4">
              <span className="text-lg xl:text-xl font-semibold">
                3-Day Forecast
              </span>
              {forecastDays?.map((day, idx) => (
                <div
                  key={idx}
                  className="w-full flex items-center justify-between"
                >
                  <div className="font-semibold">
                    <h4 className="text-base xl:text-lg">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </h4>
                    <span className="text-sm xl:text-base text-stone-600">
                      {day.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-12">
                    <span className="text-lg xl:text-xl font-semibold">
                      {day.day.avgtemp_c}°C
                    </span>
                    <img
                      src={getWeatherIcon(day.day.condition.text)}
                      alt={day.day.condition.text}
                      className="w-10 xl:w-16"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Initial State or Error */}
      {!loading && !weatherData && (
        <div className="w-full h-full pt-8 px-2 text-center flex flex-col gap-8 items-center justify-center">
          <img
            src={LocationImage}
            alt="Location"
            className="w-[75%] md:w-1/2 xl:w-1/4"
          />
          <p className="md:w-3/4 xl:w-2/4 text-lg md:text-xl font-semibold leading-tight text-stone-600">
            {error ||
              "Allow location access or search for a city to get weather updates."}
          </p>
          <button
            onClick={handleUseLocation}
            className="p-4 px-10 text-lg md:text-xl xl:text-lg font-semibold leading-none rounded-full text-white bg-blue-500 hover:bg-blue-800 transition duration-200"
          >
            Use My Location
          </button>
        </div>
      )}
    </div>
  );
};

export default Weather;

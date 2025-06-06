import '../styles/Weather.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Weather() {
    const [locationData, setLocationData] = useState(null);
    const [weather, setWeather] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    const [forecast, setForecast] = useState(null);
    const openweathermapAPIKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get('http://ip-api.com/json');
                setLocationData(response.data);
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };
        fetchLocation();
    }, []);

    useEffect(() => {
        if(locationData && openweathermapAPIKey) {
            const fetchWeather = async () => {
                try {
                    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                        params: {
                            lat: locationData.lat,
                            lon: locationData.lon,
                            appid: openweathermapAPIKey,
                            units: 'metric',
                        },
                    });
                    setWeather(response.data);
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            };
            fetchWeather();
            const fetchAirQuality = async () => {
                try {
                    const response = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
                        params: {
                            lat: locationData.lat,
                            lon: locationData.lon,
                            appid: openweathermapAPIKey,
                        },
                    });
                    setAirQuality(response.data);
                } catch (error) {
                    console.error('Error fetching air quality data:', error);
                }
            };
            fetchAirQuality();
            const fetchForecast = async () => {
                try {
                    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                        params: {
                            lat: locationData.lat,
                            lon: locationData.lon,
                            units: 'metric',
                            appid: openweathermapAPIKey,
                        },
                    });
                    setForecast(response.data);
                } catch (error) {
                    console.error('Error fetching forecast data:', error);
                }
            };
            fetchForecast();
        }
    }, [locationData, openweathermapAPIKey]);

    function getVisibilityDescription(km) {
        if (km >= 10) return 'Excellent';
        if (km >= 5) return 'Good';
        if (km >= 1) return 'Moderate';
        return 'Poor';
    }

    function getWindDirection(deg) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(deg / 45) % 8;
        return directions[index];
    }

    function getAQILevel(pollutant, value) {
        const thresholds = {
            co: [
                { max: 4400, level: 'Good' },
                { max: 9400, level: 'Fair' },
                { max: 12400, level: 'Moderate' },
                { max: 15400, level: 'Poor' },
                { max: Infinity, level: 'Very Poor' },
            ],
            no2: [
                { max: 40, level: 'Good' },
                { max: 70, level: 'Fair' },
                { max: 150, level: 'Moderate' },
                { max: 200, level: 'Poor' },
                { max: Infinity, level: 'Very Poor' },
            ],
            o3: [
                { max: 60, level: 'Good' },
                { max: 100, level: 'Fair' },
                { max: 140, level: 'Moderate' },
                { max: 180, level: 'Poor' },
                { max: Infinity, level: 'Very Poor' },
            ],
            so2: [
                { max: 20, level: 'Good' },
                { max: 80, level: 'Fair' },
                { max: 250, level: 'Moderate' },
                { max: 350, level: 'Poor' },
                { max: Infinity, level: 'Very Poor' },
            ],
            pm10: [
                { max: 20, level: 'Good' },
                { max: 50, level: 'Fair' },
                { max: 100, level: 'Moderate' },
                { max: 200, level: 'Poor' },
                { max: Infinity, level: 'Very Poor' },
            ],
            pm2_5: [
                { max: 10, level: 'Good' },
                { max: 25, level: 'Fair' },
                { max: 50, level: 'Moderate' },
                { max: 75, level: 'Poor' },
                { max: Infinity, level: 'Very Poor' },
            ],
        };

        const pollutantThresholds = thresholds[pollutant.toLowerCase()];
        if (!pollutantThresholds) return 'Unknown';

        for (const threshold of pollutantThresholds) {
            if (value <= threshold.max) {
                return threshold.level;
            }
        }

        return 'Unknown';
    }

    return (
        <div className="page">
            <div className="location">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">{locationData?.city}</h1>
                <h2 className="text-2xl font-semibold mb-2 text-gray-700">{locationData?.country}</h2>
            </div>
            <div className="weather">
                <p>
                {
                    new Date(weather?.dt * 1000)?.toLocaleString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: false
                    })
                }
                </p>
                <p>
                    {weather?.weather?.[0]?.description ? weather?.weather?.[0]?.description?.charAt(0)?.toUpperCase() + weather?.weather?.[0]?.description?.slice(1) : 'No description available'}
                </p>
                <p>Temperature: {weather?.main?.temp} degrees Celsius</p>
                <p>Feels like: {weather?.main?.feels_like} degrees Celsius</p>
                <p>Max: {weather?.main?.temp_max} degrees Celsius</p>
                <p>Min: {weather?.main?.temp_min} degrees Celsius</p>
                <p>Cloud cover: {weather?.clouds?.all}%</p>
                <p>Humidity: {weather?.main?.humidity}%</p>
                <p>Pressure: {weather?.main?.pressure} hPa</p>
                <p>Ground level: {weather?.main?.grnd_level} hPa</p>
                <p>Sea level: {weather?.main?.sea_level} hPa</p>
                <p>
                    Sunrise:{" "}
                    {
                        new Date(weather?.sys?.sunrise * 1000)?.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }
                </p>
                <p>
                    Sunset:{" "}
                    {
                        new Date(weather?.sys?.sunset * 1000)?.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }
                </p>
                <p>
                    Visibility:{" "}
                    {
                       Math.round(weather?.visibility / 1000)
                    }
                    {" "}km{" "}({getVisibilityDescription(Math.round(weather?.visibility / 1000))})
                </p>
                <p>
                    Wind:{" "}
                    {
                        (weather?.wind?.speed * 3.6)?.toFixed(1)
                    }
                    {" "}km/h
                </p>
                <p>
                    Direction:{" "}
                    {
                        getWindDirection(weather?.wind?.deg)
                    }
                </p>
                <p>
                    CO:{" "}
                    {
                        airQuality?.list?.[0]?.components?.co
                    }{" "}μg/m³{" "}({getAQILevel('co', airQuality?.list?.[0]?.components?.co)})
                </p>
                <p>
                    NH₃:{" "}
                    {
                        airQuality?.list?.[0]?.components?.nh3
                    }{" "}μg/m³
                </p>
                <p>
                    NO:{" "}
                    {
                        airQuality?.list?.[0]?.components?.no
                    }{" "}μg/m³
                </p>
                <p>
                    NO₂:{" "}
                    {
                        airQuality?.list?.[0]?.components?.no2
                    }{" "}μg/m³{" "}({getAQILevel('no2', airQuality?.list?.[0]?.components?.no2)})
                </p>
                <p>
                    O₃:{" "}
                    {
                        airQuality?.list?.[0]?.components?.o3
                    }{" "}μg/m³{" "}({getAQILevel('o3', airQuality?.list?.[0]?.components?.o3)})
                </p>
                <p>
                    PM2.5:{" "}
                    {
                        airQuality?.list?.[0]?.components?.pm2_5
                    }{" "}μg/m³{" "}({getAQILevel('pm2_5', airQuality?.list?.[0]?.components?.pm2_5)})
                </p>
                <p>
                    PM10:{" "}
                    {
                        airQuality?.list?.[0]?.components?.pm10
                    }{" "}μg/m³{" "}({getAQILevel('pm10', airQuality?.list?.[0]?.components?.pm10)})
                </p>
                <p>
                    SO₂:{" "}
                    {
                        airQuality?.list?.[0]?.components?.so2
                    }{" "}μg/m³{" "}({getAQILevel('so2', airQuality?.list?.[0]?.components?.so2)})
                </p>
            </div>
        </div>
    );
}

export default Weather;
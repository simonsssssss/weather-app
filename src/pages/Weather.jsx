import '../styles/Weather.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Weather() {
    const [locationData, setLocationData] = useState(null);
    const [weather, setWeather] = useState(null);
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
        }
    }, [locationData, openweathermapAPIKey]);console.log(weather);

    return (
        <div className="weather">
            {locationData ? (
                <div>
                    <p>City: {locationData?.city}</p>
                    <p>Country: {locationData?.country}</p>
                    <p>Latitude: {locationData?.lat}</p>
                    <p>Longitude: {locationData?.lon}</p>
                </div>
            ) : (
                <p>Loading location...</p>
            )}
        </div>
    );
}

export default Weather;
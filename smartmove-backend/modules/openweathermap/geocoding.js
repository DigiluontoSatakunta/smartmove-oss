const fetch = require("node-fetch");

const BASE_URL = "http://api.openweathermap.org/geo/1.0";
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

const options = {
  method: "get",
  headers: {
    Charset: "UTF-8",
    Accept: "application/json",
  },
};

/*
 * Reverse geocoding
 * Reverse geocoding allows to get name of the location (city name or area name) by using geografical
 * coordinates (lat, lon). The limit parameter in the API call allows you to cap how many location
 * names you will see in the API response.
 * Read more: https://openweathermap.org/api/geocoding-api#reverse
 */
const getOpenWeatherMapLocationsByCoordinates = async ({
  lat,
  lon,
  limit = 5,
}) => {
  const params = new URLSearchParams({
    lat,
    lon,
    limit,
    appid: API_KEY,
  });

  return fetch(`${BASE_URL}/reverse?${params}`, options).then(res =>
    res.json()
  );
};

module.exports = {
  getOpenWeatherMapLocationsByCoordinates,
};

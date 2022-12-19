const fetch = require("node-fetch");

const BASE_URL =
  process.env.PLOTR_SERVICE_BASE_URL ||
  "https://smartmove.example.org/micror/r";

const options = {
  method: "get",
  headers: {
    Charset: "UTF-8",
    Accept: "text/plain",
  },
};

const getPlotrImage = async ({
  area_code,
  x_param,
  y_param,
  range_window,
  aggregate_window,
}) => {
  const params = new URLSearchParams({
    format: "base64",
    area_code,
    x_param,
    y_param,
    range_window,
    aggregate_window,
  });

  const response = await fetch(`${BASE_URL}?${params}`, options);
  const base64 = await response.text();
  return {image: base64};
};

module.exports = {
  getPlotrImage,
};

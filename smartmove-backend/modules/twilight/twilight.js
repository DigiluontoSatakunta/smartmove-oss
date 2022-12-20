const fetch = require("node-fetch");
const fs = require("fs/promises");
const {v4: uuidv4} = require("uuid");
const {request} = require("http");

const BASE_URL = "https://api.sunrise-sunset.org";

const options = {
  method: "get",
  headers: {
    Charset: "UTF-8",
    Accept: "application/json",
  },
};

const getTwilight = async ({lat, lng, date}) => {
  const params = new URLSearchParams({
    date,
    lat,
    lng,
    formatted: 0,
  });

  return fetch(`${BASE_URL}/json?${params}`, options)
    .then(res => res.json())
    .then(res => res.results)
    .then(data => ({...data, id: uuidv4()}));
};

const getTwilightPori = async ({date}) => {
  // read data from twilight_data.json with fs
  const twilight_data = await fs.readFile(
    "./modules/twilight/twilight_data.json",
    "utf8"
  );
  const data = JSON.parse(twilight_data);
  // find the record with the correct date
  const record = data.find(record => record.solar_noon.split("T")[0] === date);
  // return the record
  return {
    ...record,
    id: uuidv4(),
  };
};

module.exports = {
  getTwilight,
  getTwilightPori,
};

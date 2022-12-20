const fetch = require("node-fetch");
const {v4: uuidv4} = require("uuid");

const BASE_URL = "https://tulikartta.fi";

const options = {
  method: "get",
  headers: {
    Charset: "UTF-8",
    Accept: "application/json",
  },
};

const getFireplaces = async ({type, county}) => {
  const params = !type
    ? new URLSearchParams({maakunta: county})
    : new URLSearchParams({maakunta: county, tyyppi: type});

  return fetch(`${BASE_URL}/api-json.php?${params}`, options)
    .then(res => res.json())
    .then(data =>
      data?.features?.map(f => ({
        ...f,
        name: f?.properties?.name,
        type: f?.properties?.tyyppi,
        county: f?.properties?.maakunta,
        coordinates: f?.geometry?.coordinates,
        id: uuidv4(),
      }))
    );
};

module.exports = {
  getFireplaces,
};

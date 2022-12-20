const fetch = require("node-fetch");

/*
 * Check DIGITRAFFIC documentation for more info
 * @ https://tie.digitraffic.fi/swagger/
 * @ https://www.digitraffic.fi/ohjeita/
 */

const BASE_URL = "https://tie.digitraffic.fi";

const options = {
  method: "get",
  headers: {
    Charset: "UTF-8",
    Accept: "application/json",
    AcceptEncoding: "gzip",
    UserAgent: "SmartMove",
    DigitrafficUser: "SmartMove/Default-GitUser",
  },
};

const roadNumbers = [11, 8, 23, 2]; // selected roads for the project

const getTmsStationsMetaData = async ({
  lastUpdated = false,
  state = "active",
}) => {
  const params = new URLSearchParams({
    lastUpdated,
    state,
  });

  return fetch(`${BASE_URL}/api/v3/metadata/tms-stations?${params}`, options)
    .then(res => res.json())
    .then(data =>
      data?.features?.filter(s =>
        roadNumbers?.includes(s?.properties?.roadAddress?.roadNumber)
      )
    );
};

const getTmsStation = async ({ number }) => {
  return fetch(
    `${BASE_URL}/api/v3/tms-stations/tms-number/${number}`,
    options
  ).then(res => res.json());
};

const getTmsSensorsMetaData = async ({ lastUpdated = false }) => {
  const params = new URLSearchParams({
    lastUpdated,
  });

  return fetch(
    `${BASE_URL}/api/v3/metadata/tms-sensors?${params}`,
    options
  ).then(res => res.json());
};

const getTmsSensorLamData = async ({ id }) => {
  return fetch(`${BASE_URL}/api/v1/data/tms-data/${id}`, options).then(res =>
    res.json()
  );
};

const getAllSensorLamData = async () => {
  return fetch(`${BASE_URL}/api/v1/data/tms-data`, options).then(res =>
    res.json()
  );
};

module.exports = {
  getTmsStationsMetaData,
  getTmsSensorsMetaData,
  getTmsSensorLamData,
  getAllSensorLamData,
  getTmsStation,
};

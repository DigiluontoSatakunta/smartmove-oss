const fetch = require("node-fetch");

const BASE_URL = "https://apieco.eco-counter-tools.com/api/1.0";
const AUTH_TOKEN = "Bearer YourTokenYourTokenYourToken";

const options = {
  method: "get",
  headers: {
    Charset: "UTF-8",
    Accept: "application/json",
    Authorization: AUTH_TOKEN,
  },
};

const getSites = async ({offset = 0, limit = 500}) =>
  fetch(`${BASE_URL}/site`, options)
    .then(res => res.json())
    .then(data => data?.slice(offset, offset + limit));

const getSiteById = async ({id}) =>
  fetch(`${BASE_URL}/site/${id}`, options).then(res => res.json());

const getCounters = async ({offset = 0, limit = 500}) =>
  fetch(`${BASE_URL}/counter`, options)
    .then(res => res.json())
    .then(data => data?.slice(offset, offset + limit));

const getCounterBySerial = async serial =>
  fetch(`${BASE_URL}/counter/${serial}`, options).then(res => res.json());

const getData = async ({
  id,
  begin = "2021-01-01T00:00:00",
  end = "2024-01-01T00:00:00",
  step = "day",
  complete = true,
}) => {
  const params = new URLSearchParams({
    id,
    begin,
    end,
    step,
    complete,
  });
  return fetch(`${BASE_URL}/data/site/${id}?${params}`, options).then(res =>
    res.json()
  );
};

module.exports = {
  getSites,
  getSiteById,
  getCounters,
  getCounterBySerial,
  getData,
};

const fetch = require("node-fetch");
const fs = require("fs");

const BASE_URL = process.env.SMARTMOVE_HACKLAB_BASE_URL;
const TOKEN = process.env.SMARTMOVE_HACKLAB_API_AUTH_TOKEN;

const options = {
  method: "get",
  headers: {
    Charset: "UTF-8",
    Accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};

const getDoorStateHistory = async () => {
  return await fs.promises
    .readFile("modules/hacklab/hacklab-history.json", {
      encoding: "utf8",
    })
    .then(JSON.parse);
};

const getDoorStateLatest = async ({order = "-received_at", limit = 1}) => {
  const params = new URLSearchParams({
    order,
    limit,
  });

  return fetch(`${BASE_URL}/uplink_message?${params}`, options).then(res =>
    res.json()
  );
};

module.exports = {
  getDoorStateLatest,
  getDoorStateHistory,
};

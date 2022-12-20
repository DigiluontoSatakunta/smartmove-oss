const xml2js = require("xml2js");
const fetch = require("node-fetch");
const getLabels = require("./weatherLabels.js").getLabels;

const options = {
  method: "get",
  headers: {
    charset: "UTF-8",
    accept: "application/xml",
  },
};

const getForecast = async function ({location = "Pori"}) {
  // Ilmatieteenlaitos HIRLAM API is permanently down. Needs an alternative implementation.
  return [];

  const BASE_URL = "https://opendata.fmi.fi/wfs?";
  const params = new URLSearchParams({
    request: "getFeature",
    storedquery_id: "fmi::forecast::hirlam::surface::point::timevaluepair",
    place: location,
  });

  let result = {};

  await fetch(`${BASE_URL}${params}`, options)
    .then(res => res.text())
    .then(data => {
      const parser = new xml2js.Parser({
        ignoreAttrs: false,
        mergeAttrs: true,
      });
      parser.parseString(data, (err, data) => {
        result.err = err;
        result.data = data;
      });
    });

  const cleaned = await cleanJSON(location, result.data);

  return cleaned;
};

const cleanJSON = async (location, data) => {
  let cleanedData = {};

  const collection = data["wfs:FeatureCollection"]["wfs:member"];

  cleanedData.place = location;
  cleanedData.measurements = {};

  let measurementData = ["", "", ""];

  for (let i = 0; i < collection.length; i++) {
    let m =
      collection[i]["omso:PointTimeSeriesObservation"][0]["om:result"][0][
        "wml2:MeasurementTimeseries"
      ][0];
    let measurement = m["gml:id"][0];

    let measurementID = measurement.split("-").pop();

    getLabels(measurementID, measurementData);

    cleanedData.measurements[measurementID] = {
      label: measurementData[0],
      symbol: measurementData[1],
      values: [],
    };

    for (let j = 0; j < m["wml2:point"].length; j++) {
      cleanedData.measurements[measurementID].values.push({
        time: m["wml2:point"][j]["wml2:MeasurementTVP"][0]["wml2:time"][0],
        value: m["wml2:point"][j]["wml2:MeasurementTVP"][0]["wml2:value"][0],
      });
    }
  }

  return cleanedData;
};

module.exports = {
  getForecast,
};

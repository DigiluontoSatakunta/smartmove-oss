const {
  getData,
  getSites,
  getSiteById,
  getCounters,
  getCounterBySerial,
} = require("./modules/metsahallitus/counters");

const {
  getInstagramFeedByHashtag,
  getInstagramFeedByLocation,
  getInstagramFeedByUsername,
} = require("./modules/ig/ig");

const {
  getDoorStateLatest,
  getDoorStateHistory,
} = require("./modules/hacklab/hacklab");

const {
  getGeoSearch,
  getPage,
  getPageParsedContent,
} = require("./modules/wikipedia/wikipedia");

const {
  getTmsStationsMetaData,
  getTmsSensorsMetaData,
  getTmsSensorLamData,
  getAllSensorLamData,
  getTmsStation,
} = require("./modules/digitraffic/digitraffic");

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("./modules/favorites/favorites");

const {
  getOpenWeatherMapLocationsByCoordinates,
} = require("./modules/openweathermap/geocoding");

const {getFireplaces} = require("./modules/fireplaces/fireplaces");

const {getForecast} = require("./modules/meteorologicalinstitue/fmiconverter");

const {getTwilight, getTwilightPori} = require("./modules/twilight/twilight");

const {
  getHeatmapData,
  getPeopleCounter,
  getOperatorDataByAreaCode,
  getWeatherData,
} = require("./modules/influxdb/influxdb");

const {
  getSykeTopListOfCompanies,
  getSykeNaceAggregations,
} = require("./modules/syke/syke");

const {getPlotrImage} = require("./modules/plotr/plotr");

const Query = {
  data: (_, params) => getData(params),
  sites: (_, params) => getSites(params),
  site: (_, params) => getSiteById(params),
  counters: (_, params) => getCounters(params),
  counter: (_, {serial}) => getCounterBySerial(serial),
  doorLatest: (_, params) => getDoorStateLatest(params),
  doorHistory: (_, params) => getDoorStateHistory(params),
  instagramFeedByHashtag: (_, params) => getInstagramFeedByHashtag(params),
  instagramFeedByUsername: (_, params) => getInstagramFeedByUsername(params),
  instagramFeedByLocation: (_, params) => getInstagramFeedByLocation(params),
  wikipediaGeoSearch: (_, params) => getGeoSearch(params),
  wikipediaPage: (_, params) => getPage(params),
  wikipediaPageParsedContent: (_, params) => getPageParsedContent(params),
  digitrafficTmsStationsMetaData: (_, params) => getTmsStationsMetaData(params),
  digitrafficTmsSensorsMetaData: (_, params) => getTmsSensorsMetaData(params),
  digitrafficTmsSensorLamData: (_, params) => getTmsSensorLamData(params),
  digitrafficAllSensorLamData: (_, params) => getAllSensorLamData(params),
  digitrafficTmsStation: (_, params) => getTmsStation(params),
  favorites: (_, params) => getFavorites(params),
  openWeatherMapLocationsByCoordinates: (_, params) =>
    getOpenWeatherMapLocationsByCoordinates(params),
  fireplaces: (_, params) => getFireplaces(params),
  forecast: (_, params) => getForecast(params),
  twilight: (_, params) => getTwilight(params),
  twilightPori: (_, params) => getTwilightPori(params),
  peopleCounter: (_, params) => getPeopleCounter(params),
  operatorDataByAreaCode: (_, params) => getOperatorDataByAreaCode(params),
  heatmapData: (_, params) => getHeatmapData(params),
  weatherData: (_, params) => getWeatherData(params),
  sykeTopListOfCompanies: (_, params) => getSykeTopListOfCompanies(params),
  sykeNaceAggregations: (_, params) => getSykeNaceAggregations(params),
  plotr: (_, params) => getPlotrImage(params),
};

const Mutation = {
  addFavorite: (_, params) => addFavorite(params),
  removeFavorite: (_, params) => removeFavorite(params),
};

module.exports = {Query, Mutation};

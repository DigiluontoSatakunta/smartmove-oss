const {isPointInPolygon} = require("geolib");
const {groupBy} = require("lodash");

const companies = require("./syke_companies_final.json");
const areas = require("./YKRKaupunkiMaaseutuLuokitus.json");
const industries = require("./codelist_toimiala_1_20080101.json");

const getIndustryName = nace => {
  const {codes} = industries;
  const industry = codes.find(code => code.codeValue === nace);
  const name = industry ? industry.prefLabel.fi : "Tuntematon";
  return name;
};

const getCompaniesInArea = async ({id}) => {
  const area = areas.features.find(a => a?.id === id);
  const coordinates = area?.geometry?.coordinates;
  // convert all the coordinates to a polygons
  const polygon = coordinates.flatMap(c =>
    c.map(([x, y]) => ({latitude: y, longitude: x}))
  );

  // find companies within the coordinates of the area
  const companiesInArea = companies.filter(c => {
    const {lat: latitude, lng: longitude} = c?.geometry?.location;
    return isPointInPolygon({latitude, longitude}, polygon);
  });

  return companiesInArea;
};

const getSykeNaceAggregations = async ({id}) => {
  console.log("getSykeNaceAggregations with area id: ", id);
  // find the area by id
  const companies = await getCompaniesInArea({id});

  console.log("companies in area: ", companies.length);

  // map companies properties: nace and turnover
  const mappedValues = companies.map(c => {
    const {nace, turnover} = c;
    return {nace: nace.substring(0, 2), turnover};
  });

  const groupedValues = groupBy(mappedValues, "nace");

  // calculate sum of turnover for each nace
  const summedValues = Object.entries(groupedValues).map(([nace, values]) => {
    const sum = values.reduce((acc, {turnover}) => acc + turnover, 0);
    return {nace, value: sum};
  });

  const sortedValues = summedValues.sort((a, b) => b.value - a.value);

  const result = sortedValues.map(({nace, value}) => ({
    nace,
    value,
    naceName: getIndustryName(nace),
  }));

  return result;
};

const getSykeTopListOfCompanies = async ({id, classification, type}) => {
  // find the area by id
  const companies = await getCompaniesInArea({id});

  return companies?.slice(0, 10);
};

module.exports = {
  getSykeTopListOfCompanies,
  getSykeNaceAggregations,
};

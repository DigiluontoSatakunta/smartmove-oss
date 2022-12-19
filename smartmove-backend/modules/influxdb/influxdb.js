// https://github.com/influxdata/influxdb-client-js/tree/master/examples
const {InfluxDB, FluxTableMetaData} = require("@influxdata/influxdb-client");

const url = process.env.INFLUX_URL || "https://influx.example.org";
const org = process.env.INFLUX_ORGID || "0000000000000000";
const bucket = "operaattori";

const token =
  process.env.INFLUX_TOKEN ||
  "default_token"; // read only token

const queryApi = new InfluxDB({url, token}).getQueryApi(org);

const getPeopleCounter = async ({
  start,
  stop = "today()",
  aggregateWindow = "1h",
}) => {
  const fluxQuery = `from(bucket: "telegraf")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "counter")
  |> filter(fn: (r) => r["location"] == "kippo")
  |> filter(fn: (r) => r["_field"] == "counter_b")
  |> aggregateWindow(every: ${aggregateWindow}, fn: sum, createEmpty: false)
  |> yield(name: "sum")`;

  const data = await queryApi.collectRows(fluxQuery);
  const result = data.map(x => ({time: x._time, value: x._value}));

  return {result};
};

const getHeatmapData = async ({start, stop}) => {
  const fluxQuery = `from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "peopleCount")
  |> filter(fn: (r) => r["_field"] == "people")
  |> group(columns: ["area_code"])
  |> sum(column: "_value")
  |> group()
  |> yield(name: "data")`;

  const data = await queryApi.collectRows(fluxQuery);

  const result = data.map(x => ({value: x._value, areaCode: x.area_code}));

  return result;
};

const getOperatorDataByAreaCode = async ({
  areaCode,
  start,
  stop = start,
  aggregateWindow = "1d",
}) => {
  const fluxQuery = `from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "peopleCount")
  |> filter(fn: (r) => r["area_code"] == "${areaCode}")
  |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)
  |> keep(columns: ["_value", "_time", "area_code"])
  |> yield(name: "data")`;

  const data = await queryApi.collectRows(fluxQuery);

  const result = data.map(x => ({
    time: x._time,
    value: Math.round(x._value),
    areaCode: parseInt(x.area_code),
  }));

  return result;
};

const getWeatherData = async ({
  station,
  element,
  start,
  stop,
  aggregateWindow = "1h",
  fn = "mean",
}) => {
  const fluxQuery = `data = from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "weather")
  |> filter(fn: (r) => r["station"] == "${station}")
  |> filter(fn: (r) => r["_field"] == "${element}")
  |> map(fn: (r) => ({ r with _value: float(v: r._value) }))
  |> aggregateWindow(every: ${aggregateWindow}, fn: ${fn}, createEmpty: false)
  |> keep(columns: ["_value", "_time"])
  |> yield(name: "data")`;

  const data = await queryApi.collectRows(fluxQuery);

  const result = data.map(x => ({
    time: x._time,
    value: Math.round(x._value),
  }));

  return result;
};

module.exports = {
  getPeopleCounter,
  getOperatorDataByAreaCode,
  getHeatmapData,
  getWeatherData,
};

// Execute query and receive table metadata and table row values using async iterator.
async function iterateRows() {
  console.log("*** IterateRows ***");
  for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
    // the following line creates an object for each row
    const o = tableMeta.toObject(values);
    // console.log(JSON.stringify(o, null, 2))
    console.log(
      `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
    );

    // alternatively, you can get only a specific column value without
    // the need to create an object for every row
    // console.log(tableMeta.get(row, '_time'))
  }
  console.log("\nIterateRows SUCCESS");
}
// iterateRows().catch((error) => console.error('IterateRows ERROR', error))

// Execute query and receive table metadata and rows in a result observer.
function queryRows() {
  console.log("*** QueryRows ***");
  queryApi.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
      // the following line creates an object for each row
      const o = tableMeta.toObject(row);
      // console.log(JSON.stringify(o, null, 2))
      console.log(
        `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
      );

      // alternatively, you can get only a specific column value without
      // the need to create an object for every row
      // console.log(tableMeta.get(row, '_time'))
    },
    error: error => {
      console.error(error);
      console.log("\nQueryRows ERROR");
    },
    complete: () => {
      console.log("\nQueryRows SUCCESS");
    },
  });
}
// queryRows()

// Execute query and collect result rows in a Promise.
// Use with caution, it copies the whole stream of results into memory.
async function collectRows() {
  console.log("\n*** CollectRows ***");
  const data = await queryApi.collectRows(
    fluxQueryPeopleCounter //, you can also specify a row mapper as a second argument
  );
  data.forEach(x => console.log(JSON.stringify(x)));
  console.log("\nCollect ROWS SUCCESS");
}
// collectRows().catch((error) => console.error('CollectRows ERROR', error))

// Execute query and return the whole result as a string.
// Use with caution, it copies the whole stream of results into memory.
async function queryRaw() {
  const result = await queryApi.queryRaw(fluxQueryPeopleCounter);
  console.log(result);
  console.log("\nQueryRaw SUCCESS");
}
// queryRaw().catch((error) => console.error('QueryRaw ERROR', error))

// Execute query and receive result CSV lines in an observer
function queryLines() {
  queryApi.queryLines(fluxQuery, {
    next: line => {
      console.log(line);
    },
    error: error => {
      console.error(error);
      console.log("\nQueryLines ERROR");
    },
    complete: () => {
      console.log("\nQueryLines SUCCESS");
    },
  });
}
// queryLines()

const {getCounterBySerial} = require("./modules/metsahallitus/counters");

const Site = {
  async counter(queries, {reply}) {
    return queries.map(({obj}) =>
      obj?.counter ? getCounterBySerial(obj?.counter) : null
    );
  },
};

module.exports = {Site};

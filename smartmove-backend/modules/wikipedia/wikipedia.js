const fetch = require("node-fetch");

/*
 * check WIKIMEDIA documentation for more info
 * @ https://www.mediawiki.org/wiki/API:Geosearch
 */

const BASE_URL = "https://en.wikipedia.org/w/api.php";

const options = {
  method: "get",
  headers: {
    Charset: "UTF-8",
    Accept: "application/json",
    AcceptEncoding: "gzip",
    UserAgent: "SmartMove/0.0.1 (contact information teemu.jonkkari@tuni.fi)",
  },
};

const getGeoSearch = async ({gscoords, gsradius = 500, gslimit = 100}) => {
  const params = new URLSearchParams({
    action: "query",
    list: "geosearch",
    format: "json",
    maxlag: 4,
    gscoord: gscoords,
    gsradius: gsradius,
    gslimit: gslimit,
  });
  return fetch(`${BASE_URL}?${params}`, options).then(res => res.json());
};

const getPage = async ({pageid}) => {
  const params = new URLSearchParams({
    action: "query",
    pageids: pageid,
    format: "json",
    prop: "images|revisions",
    rvslots: "*",
    rvprop: "content",
    formatversion: 2,
  });

  // https://en.wikipedia.org/w/api.php?action=query&pageids=68060178&format=json&prop=images|revisions&rvslots=*&rvprop=content&formatversion=2
  return fetch(`${BASE_URL}?${params}`, options).then(res => res.json());
};

const getPageParsedContent = async ({pageid}) => {
  const params = new URLSearchParams({
    action: "parse",
    format: "json",
    pageid: pageid,
    prop: "text",
  });

  // https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid=7412236&prop=text
  return fetch(`${BASE_URL}?${params}`, options)
    .then(res => res.json())
    .then(data => {
      const obj = data?.parse?.text; // get the text from the parsed page with * attribute
      const asterix = obj[Object.keys(obj)[0]];
      return {text: asterix};
    });
};

module.exports = {
  getGeoSearch,
  getPage,
  getPageParsedContent,
};

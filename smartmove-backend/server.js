"use strict";

require("dotenv").config();

const fs = require("fs");
const fastify = require("fastify");
const mercurius = require("mercurius");
const cache = require("mercurius-cache");
const Redis = require("ioredis");

const PORT = process.env.SMARTMOVE_API_PORT || 4040;
const PLAYGROUND = process.env.SMARTMOVE_API_PLAYGROUND || true;
const HOST = process.env.SMARTMOVE_API_HOST || "localhost";
const IOREDIS_CONNECTION =
  process.env.SMARTMOVE_REDIS || "redis://127.0.0.1:6379";
const logger = process.env.NODE_ENV === "production" ? false : true;

const app = fastify({
  logger,
});

const schema = fs.readFileSync("./schema.graphql", {encoding: "utf8"});
const resolvers = require("./resolvers");
const loaders = require("./loaders");

app.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["POST", "GET"],
});

app.register(require("@fastify/http-proxy"), {
  upstream: "https://scontent-hel3-1.cdninstagram.com/v/",
  prefix: "/v/",
  http2: false,
  cacheURLs: 1000,
  replyOptions: {
    rewriteHeaders: (headers, req) => ({
      ...headers,
      "Cross-Origin-Resource-Policy": "cross-origin",
    }),
  },
});

app.register(mercurius, {
  schema,
  resolvers,
  loaders,
  graphiql: PLAYGROUND,
  queryDepth: 10,
});

// https://github.com/mercurius-js/cache
app.register(cache, {
  ttl: 36000, // 10 hours
  policy: {
    Query: {
      sites: true,
      site: true,
      counters: true,
      counter: true,
      data: {
        ttl: 3600, // 1 hour
      },
      doorLatest: {
        ttl: 10, // 10 seconds
      },
      doorHistory: true,
      instagramFeedByHashtag: 86400 * 7, // 1 week
      instagramFeedByUsername: 86400 * 7,
      instagramFeedByLocation: 86400 * 7,
      wikipediaPageParsedContent: 86400 * 7,
      wikipediaPage: 86400 * 7,
      wikipediaGeoSearch: 86400,
      digitrafficTmsSensorLamData: 300, // 5 min
      digitrafficAllSensorLamData: 300, // 5 min
      digitrafficTmsSensorsMetaData: true,
      digitrafficTmsStationsMetaData: true,
      openWeatherMapLocationsByCoordinates: 86400 * 365, // 1 year
      fireplaces: 86400 * 7 * 2, // 2 weeks
      forecast: 21600, // 6 hours
      twilight: 86400 * 365, // 1 year
      twilightPori: 86400 * 365, // 1 year
      peopleCounter: 3600, // 1 hour
      weatherData: 3600, // 1 hour
      heatmapData: 3600, // 1 hour
      plotr: 86400 * 365, // 1 year
    },
  },
  storage: {
    type: "redis",
    options: {
      client: new Redis(IOREDIS_CONNECTION),
      invalidation: true,
    },
  },
});

app.get("/", async function (req, reply) {
  reply.code(200).send({hello: "world"});
});

app
  .listen(PORT, HOST)
  .then(() =>
    console.log(`🚀 Server ready at http://${HOST}:${PORT}/graphiql`)
  );

process.on("SIGINT", closeHandler);
process.on("SIGTERM", closeHandler);

function closeHandler(event) {
  app.close().then(
    () => {
      console.log(`Server successfully closed on ${event}`);
      process.exit(0);
    },
    err => {
      console.log("an error happened", err);
      process.exit(2);
    }
  );
}

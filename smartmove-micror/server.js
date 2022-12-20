"use strict";

require("dotenv").config();

const fastify = require("fastify");
const fs = require('fs');
const crypto = require('crypto');
const child_process = require('child_process');

const PORT = process.env.PORT || 3066;
const HOST = process.env.HOST || "127.0.0.1";
const CMD_R_SCRIPT = process.env.CMD_R_SCRIPT;

const logger = process.env.NODE_ENV === "production" ? false : true;

const app = fastify({
  logger,
});

app.register(require("fastify-healthcheck"), {
  healthcheckUrl: "/healthcheck",
  exposeUptime: true,
});

// Handle all content types that matches RegExp
app.addContentTypeParser(/^image\/.*/, function (request, payload, done) {
  imageParser(payload, function (err, body) {
    done(err, body)
  })
});

app.decorateReply('sendFile', (reply, filename, format, rmFile) => {
  const stream = fs.createReadStream(filename)
  if(format === "png"){
    reply.type("image/png").send(stream)
  } else if(format === "base64"){
    let data = []
    stream.on('data', (chunk) => {
      data.push(chunk);
    });
    stream.once('end', () => {
      reply.send(Buffer.concat(data).toString("base64"))
    })
  }
  if(rmFile){
    stream.once('close', (stream) => {
      fs.rmSync(filename)
    });
  }
});

/**
 * Query parameter schema & validation
 * @type {import('fastify').RouteShorthandOptions}
 * @const
 */
const rOpts = {
  schema: {
    query: {
      type: 'object',
      required: ['area_code', 'x_param', 'y_param'],
      properties: {
        aggregate_window: { 
          type: 'string', default: '1d',
          enum: ['1h', '2h', '8h', '1d', '1w', '1mo', '1y']
        },
        area_code: {
          type: 'integer', minimum: 2781, maximum: 5483
        },
        format: {
          type: 'string', default: 'png',
          enum: ['png', 'base64']
        },
        range_window: { 
          type: 'string', default: 'd',
          enum: ['h', 'd', 'j', 'w', 'mo', 'y']
        },
        x_param: {
          type: 'string', default: 'people_count',
          enum: ['people_count', 'air_temperature', 'cloud_amount', 'dew-point_temperature', 'gust_speed', 'horizontal_visibility', 'precipitation_amount', 'precipitation_intensity', 'pressure', 'relative_humidity', 'snow_depth', 'wind_direction', 'wind_speed']
        },
        y_param: {
          type: 'string', default: 'air_temperature',
          enum: ['people_count', 'air_temperature', 'cloud_amount', 'dew-point_temperature', 'gust_speed', 'horizontal_visibility', 'precipitation_amount', 'precipitation_intensity', 'pressure', 'relative_humidity', 'snow_depth', 'wind_direction', 'wind_speed']
        }
      },
    }
  }
}

// R-API
app.get("/r", rOpts, (request, reply) => {
  if(!!!CMD_R_SCRIPT){
    return reply.code(500).send("Script file not specified")
  }
  const filepath = "/tmp/"
  const filename = crypto.randomUUID() + ".png"
  const params = request.query
  const execArgs = [
    params.aggregate_window,
    params.range_window,
    params.x_param,
    params.y_param,
    params.area_code,
    filename
  ]
  try {
    child_process.execFileSync(CMD_R_SCRIPT, execArgs)
    reply.sendFile(reply, filepath+filename, params.format, true)
  } finally {
    // Nothing to do
  }
});

app
  .listen({port: PORT, host: HOST})
  .then((address) => console.log(`🚀 Server ready at ${address}`))
  .catch(err => {
    console.log('Error starting server:', err)
    process.exit(1)
  });

process.on('SIGINT', closeHandler);
process.on('SIGTERM', closeHandler);

function closeHandler(event) {
  app.close().then(() => {
      console.log(`Server successfully closed on ${event}`)
      process.exit(0)
    }, (err) => {
      console.log('an error happened', err)
      process.exit(2)
    });
};

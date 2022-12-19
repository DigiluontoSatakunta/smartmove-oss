FROM node:lts-alpine

ENV NODE_ENV=production
ENV SMARTMOVE_API_PORT=4040
ENV SMARTMOVE_API_HOST=0.0.0.0
ENV SMARTMOVE_API_PLAYGROUND=false

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --production=true

COPY . .

EXPOSE 4040

CMD [ "node", "server.js" ]

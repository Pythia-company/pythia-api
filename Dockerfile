FROM node:19.5.0-alpine

WORKDIR /app

COPY ./src .

COPY package-lock.json .
COPY package.json .
COPY .env .

RUN npm install

EXPOSE 8888

CMD [ "node", "server.js" ]
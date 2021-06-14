FROM node:slim

COPY . /app

WORKDIR /app

RUN npm install -g gulp-cli live-server

RUN npm install

EXPOSE 8080

CMD gulp prod:build && live-server /app/dist
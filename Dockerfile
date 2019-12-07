FROM node:alpine

COPY package.json /data/
COPY package-lock.json /data/
COPY src /data/src
COPY public /data/public
COPY .git/refs/heads/master /data/public/version.txt

RUN cd /data && npm i && npm test

WORKDIR /data

EXPOSE 8080

CMD ["node", "src/index.js"]

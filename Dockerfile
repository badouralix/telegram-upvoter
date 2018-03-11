FROM node:9-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV=production

COPY package.json package-lock.json /usr/src/app/
RUN npm install && npm cache clean --force

CMD [ "npm", "start" ]
FROM node:20-alpine3.17 as build

WORKDIR /home

COPY package*.json ./
COPY .env.docker ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist/index.js" ]
FROM node:18

WORKDIR /usr/src/app

COPY . .

COPY ./.env.example ./env

COPY package*.json ./

RUN npm install

RUN npm run build



CMD [ "npm", "run", "start:prod" ]

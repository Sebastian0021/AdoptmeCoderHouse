
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production
# ENV URL_MONGO=mongodb://tu_usuario:tu_contraseña@host.docker.internal:27017/adoptme

CMD [ "node", "src/app.js" ]

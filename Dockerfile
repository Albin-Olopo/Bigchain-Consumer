FROM node:22.6.0-alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "src/app.js" ]

FROM node:20.11
WORKDIR /app
COPY package*.json /app/
RUN npm i
COPY . /app
CMD npm start 

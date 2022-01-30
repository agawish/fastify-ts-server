FROM node:current-alpine3.15


ENV HOST 0.0.0.0
ENV PORT 4000

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
RUN npm run build

EXPOSE ${PORT}
CMD [ "node", "target/bundle.js" ]
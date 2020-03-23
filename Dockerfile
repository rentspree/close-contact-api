FROM node:12.14.0-alpine

RUN mkdir -p /app
WORKDIR /app
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
ADD .babelrc /app/.babelrc
ADD .eslintrc.js /app/.eslintrc.js
ADD .eslintignore /app/.eslintignore
ADD .prettierrc /app/.prettierrc
ADD configs /app/configs
ADD migrations /app/migrations
ADD seed /app/seed
ADD src /app/src
ADD test /app/test
ADD migration.config.js /app/migration.config.js

# SETUP Gemfury
ARG GEMFURY_DEPLOY_KEY
RUN echo "//npm-proxy.fury.io/rentspree/:_authToken=$GEMFURY_DEPLOY_KEY" > ~/.npmrc
RUN npm config set @rentspree:registry https://npm-proxy.fury.io/rentspree/

RUN npm install --no-cache git
RUN npm run build
ADD src/public /app/build/public
ADD src/views /app/build/views

EXPOSE 3000
CMD ["npm", "run", "start:prod"]

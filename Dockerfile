FROM node:12.14.0-alpine as alpine-deps
# Install Imagemagick
RUN apk add --no-cache file build-base python
RUN apk --update add imagemagick graphicsmagick

FROM alpine-deps as npm-i
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --silent --no-audit --no-fund


FROM alpine-deps as build-app
WORKDIR /app
COPY --from=npm-i /app .
COPY . .
RUN npm run build

FROM alpine-deps
WORKDIR /app
COPY --from=build-app /app .
ADD .babelrc .babelrc
ADD .eslintrc.js .eslintrc.js
ADD .eslintignore .eslintignore
ADD .prettierrc .prettierrc
ADD migration.config.js migration.config.js

EXPOSE 3000
CMD ["npm", "run", "start:prod"]

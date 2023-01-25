# Build stage
FROM node:14-alpine as build-stage

RUN apk add --no-cache git

COPY . /app

WORKDIR /app

RUN npm install && npm run build

# Production stage
FROM node:14-alpine

COPY --from=build-stage /app/public /app

WORKDIR /app

EXPOSE 1313

CMD ["npm", "run", "prod"]

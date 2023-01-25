# Build stage
FROM node:19.4.0-buster as build-stage

RUN apt update && apt install -y git curl

RUN curl -sSL https://github.com/gohugoio/hugo/releases/download/v0.109.0/hugo_0.109.0_linux-amd64.deb -o hugo.deb \
    && dpkg -i hugo.deb \
    && rm -rf /var/lib/apt/lists/*

COPY . /app

WORKDIR /app

RUN hugo version

RUN npm install -g pnpm && pnpm install

RUN pnpm run build

# Production stage
FROM node:19.4.0-buster

COPY --from=build-stage /app/public /app

WORKDIR /app

EXPOSE 1313

CMD ["npm", "run", "prod"]

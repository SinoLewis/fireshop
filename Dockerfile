# Build stage
FROM node:19.4.0-buster as build-stage

RUN apt update && apt install -y git curl

RUN curl -sSL https://github.com/gohugoio/hugo/releases/download/v0.109.0/hugo_0.109.0_linux-amd64.deb -o hugo.deb \
    && dpkg -i hugo.deb \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/SinoLewis/fireshop /app
# COPY . /app

WORKDIR /app

RUN npm install -g pnpm && pnpm install

RUN pnpm run build

EXPOSE 6969

# DEV DEFAULT
CMD ["npm", "start"]

# PROD
# CMD ["npm", "start"]

# DEV image
FROM redis/redis-stack

RUN apt update && apt install -y git curl


# Install hugo 
RUN curl -sSL https://github.com/gohugoio/hugo/releases/download/v0.109.0/hugo_0.109.0_linux-amd64.deb -o hugo.deb \
    && dpkg -i hugo.deb \
    && rm -rf /var/lib/apt/lists/*

#  Install node & npm 
RUN apt install -y nodejs npm

COPY . /app

WORKDIR /app

RUN npm install install

RUN pnpm run build

EXPOSE 6969

# DEV DEFAULT
CMD ["npm", "start"]

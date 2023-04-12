# DEV image
FROM redis/redis-stack

# Install melisearch 

#  Install node & npm 
RUN apt install -y nodejs npm

COPY ./server /app

WORKDIR /app

RUN npm install install

RUN pnpm run build

EXPOSE 6969

# DEV DEFAULT
CMD ["npm", "start"]

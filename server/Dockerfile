FROM node:12.22.3
WORKDIR /app
COPY package* ./
RUN npm ci
COPY . .

VOLUME ["/app/data"]
EXPOSE 4000

ENTRYPOINT ["npm", "start"]

FROM node:14.15.4
WORKDIR /app
COPY package* ./
RUN npm ci
COPY . .

VOLUME ["/app/data"]
EXPOSE 4000

ENTRYPOINT ["npm", "start"]

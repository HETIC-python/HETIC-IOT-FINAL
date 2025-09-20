FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash git

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8081
EXPOSE 19006

CMD ["npx", "expo", "start", "--web"]
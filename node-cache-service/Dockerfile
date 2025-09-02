FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --only=production

COPY . .
RUN npm install && npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
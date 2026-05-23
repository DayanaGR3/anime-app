FROM node:20-alpine

WORKDIR /app

# Copiar dependencias primero (cache layer)
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

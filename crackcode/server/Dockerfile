FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create uploads folder
RUN mkdir -p uploads

EXPOSE 5051

CMD ["npm", "start"]

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept backend URL as build argument, default to localhost:5051
ARG VITE_BACKEND_URL=http://localhost:5051

# Create .env.production file with Vite variables
RUN echo "VITE_BACKEND_URL=${VITE_BACKEND_URL}" > .env.production

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

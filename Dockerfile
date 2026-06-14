# Stage 1: Desarrollo (Desarrollo local con hot-reload)
FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "start:dev", "--", "--host"]

# Stage 2: Compilación (Builder para producción)
FROM node:20-alpine AS builder
ARG VITE_API_URL
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env
RUN npm run build

# Stage 3: Producción (Servidor ligero con Nginx)
FROM nginx:1.25-alpine AS production
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

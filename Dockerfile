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
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Producción (Servidor ligero con Nginx)
FROM nginx:1.25-alpine AS production
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx para soportar SPA (Single Page Application routing)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Al arrancar, genera dinámicamente el archivo config.js basándose en la variable de entorno VITE_API_URL
CMD ["/bin/sh", "-c", "echo \"window.env = { VITE_API_URL: '${VITE_API_URL:-/api}' };\" > /usr/share/nginx/html/config.js && nginx -g 'daemon off;'"]

FROM node:18-alpine AS build

WORKDIR /app

# The current approach is vanilla HTML/CSS/JS without a build step needed right now, 
# but structuring for potential future node.js backend or frontend build tools.
# If we were using vite:
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# Since it's vanilla static files, we just copy them directly into an Nginx server
FROM nginx:alpine

# Copy static assets to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

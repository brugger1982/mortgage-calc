# Stage 1: Build the React application
FROM node:20-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8080 (Google Cloud Run's default port)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

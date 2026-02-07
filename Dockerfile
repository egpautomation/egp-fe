# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Declare build arguments to receive environment variables
ARG VITE_API_BASE_URL
ARG VITE_API_BASE_URL_ALT
ARG VITE_EXIN_API_BASE_URL
ARG VITE_TTI_SERVER_URL
ARG VITE_IMAGEBB_API_KEY
ARG VITE_SUPPORT_WHATSAPP
ARG VITE_EGP_SITE_URL

# Set environment variables from arguments so the build script can see them
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_BASE_URL_ALT=$VITE_API_BASE_URL_ALT
ENV VITE_EXIN_API_BASE_URL=$VITE_EXIN_API_BASE_URL
ENV VITE_TTI_SERVER_URL=$VITE_TTI_SERVER_URL
ENV VITE_IMAGEBB_API_KEY=$VITE_IMAGEBB_API_KEY
ENV VITE_SUPPORT_WHATSAPP=$VITE_SUPPORT_WHATSAPP
ENV VITE_EGP_SITE_URL=$VITE_EGP_SITE_URL

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built artifacts from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash to execute the script
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g 'daemon off;'"]

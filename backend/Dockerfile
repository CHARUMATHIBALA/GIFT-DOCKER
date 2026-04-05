# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install --include=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the application directly with node
CMD ["node", "server.js"]

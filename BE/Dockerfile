FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Start the application in development mode with hot-reload
CMD ["npm", "run", "start:dev"]
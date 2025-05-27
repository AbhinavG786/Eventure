# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build TS if needed (if you use ts-node, you may skip build)
RUN npm run build

# Expose port your app listens on
EXPOSE 3000

# Run the app
CMD ["node", "dist/server.js"]

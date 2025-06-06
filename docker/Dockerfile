# Use the official Node.js image with latest LTS version
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Enable Corepack and set Yarn to version 4
RUN corepack enable && corepack prepare yarn@4 --activate

# Copy package files first (for better caching)
COPY package*.json .yarnrc.yml* ./

# Install dependencies (without lockfile first, then copy it)
RUN yarn install

# Copy lockfile and source code
COPY . .

# Expose Vite default port
EXPOSE 5173

# Default command
CMD ["sleep", "infinity"]

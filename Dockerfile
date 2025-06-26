# Stage 1: Build the NestJS application
# Using a Node.js base image with Alpine for smaller size
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json (or yarn.lock)
# to leverage Docker's layer caching for node_modules
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the NestJS application (compiles TypeScript to JavaScript)
# This command assumes you have a 'build' script in your package.json
RUN npm run build

# Stage 2: Create the final production-ready image
# Using a lightweight Node.js Alpine image for the runtime environment
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /src

# Copy only the necessary files from the builder stage:
# - node_modules: For runtime dependencies
# - dist: The compiled JavaScript output of your NestJS application
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the port your NestJS application listens on.
# NestJS often defaults to 3000. Adjust if your app uses a different port.
EXPOSE 3000

# Command to run the application
# This assumes your main compiled JavaScript file is at dist/main.js
CMD ["node", "dist/main"]
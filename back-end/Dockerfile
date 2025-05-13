# Stage 1: Build Stage
FROM node:22.14-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json if exists
COPY package.json tsconfig.json ./

# Install dependencies
RUN npm install


#INSTALL MongoDB
RUN npm install --save-dev @types/mongodb


# Add this to both RUN npm install sections:
RUN npm install @aws-sdk/client-secrets-manager

# Copy source code
COPY src ./src
COPY public ./public


# Build the TypeScript code (compiles src/*.ts into dist/*.js)
RUN npm run build

# Stage 2: Production Stage
FROM node:22.14-slim

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json .
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
#missing line  error 404 previously
COPY --from=builder /app/dist /app/public/dist  

# Install only production dependencies (no devDependencies)
RUN npm install --omit=dev

# Expose port (optional: you can specify which port your app listens to)
EXPOSE 8000

# Run the server (compiled JS from dist/server.js)
CMD ["node", "dist/server.js"]
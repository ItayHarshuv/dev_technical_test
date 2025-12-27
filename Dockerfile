# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install for better compatibility)
RUN npm install

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Verify build output
RUN ls -la dist/ && test -f dist/app.js || (echo "Build failed: dist/app.js not found" && exit 1)

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy views directory (EJS templates) from builder to dist/views for production
COPY --from=builder /app/src/views ./dist/views

# Verify files exist
RUN ls -la dist/ && test -f dist/app.js || (echo "dist/app.js not found after copy" && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]


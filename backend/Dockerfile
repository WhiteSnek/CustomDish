# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /custom-dish-backend

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /custom-dish-backend

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and source code from builder
COPY --from=builder /custom-dish-backend/node_modules ./node_modules
COPY --from=builder /custom-dish-backend ./

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Switch to non-root user
USER appuser

# Start the server
CMD ["npm", "start"]

# Health check
#HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#  CMD curl -f http://localhost:3000/health || exit 1

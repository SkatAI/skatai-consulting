FROM node:20-bookworm-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (dev + prod)
RUN npm ci

# Copy source code
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Run dev server
CMD ["npm", "run", "dev"]

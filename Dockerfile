# Use official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:v1.54.1-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Install browsers (they should already be in the base image)
RUN npx playwright install

# Set environment variables
ENV CI=true
ENV HEADLESS=true

# Create directories for test results
RUN mkdir -p test-results playwright-report

# Set permissions
RUN chmod -R 755 /app

# Expose port for test reports
EXPOSE 9323

# Default command to run tests
CMD ["npm", "test"]

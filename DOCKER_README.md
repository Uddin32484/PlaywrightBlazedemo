# Docker Setup for BlazDemo Playwright Tests

This guide shows how to run the Playwright tests using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Build and Run Tests

```bash
# Build Docker image and run tests
npm run docker:build
npm run docker:run

# Or using Docker Compose
npm run docker:test
```

### 2. Run Tests with Different Modes

```bash
# Run tests in headless mode (default)
npm run docker:test

# Run tests in headed mode (with VNC support)
npm run docker:test:headed

# Run development environment
npm run docker:dev

# Start report server
npm run docker:report
```

### 3. View Test Reports

After running tests, you can view the HTML report:

```bash
# Start report server
npm run docker:report

# Then open browser to: http://localhost:9323
```

## Docker Commands

### Manual Docker Commands

```bash
# Build image
docker build -t blazedemo-playwright .

# Run tests
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  blazedemo-playwright

# Run with environment variables
docker run --rm \
  -e HEADLESS=false \
  -e CI=false \
  -v $(pwd)/test-results:/app/test-results \
  blazedemo-playwright npm run test:main
```

### Docker Compose Commands

```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up playwright-tests

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v
```

## Available Services

### 1. playwright-tests
- Runs tests in headless mode
- Mounts test results to host
- Environment: CI=true, HEADLESS=true

### 2. playwright-headed
- Runs tests in headed mode
- VNC support on port 5900
- Environment: CI=false, HEADLESS=false

### 3. report-server
- Serves HTML test reports
- Available on http://localhost:9323

### 4. node-dev
- Development environment
- Live code mounting
- UI mode available

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| CI | true | Enable CI mode |
| HEADLESS | true | Run in headless mode |
| NODE_ENV | test | Node environment |
| DISPLAY | :99 | X11 display for headed mode |

## Volume Mounts

- `./test-results` → `/app/test-results` - Test artifacts
- `./playwright-report` → `/app/playwright-report` - HTML reports
- `./src` → `/app/src` - Source code (development)
- `./tests` → `/app/tests` - Test files (development)

## Troubleshooting

### Browser Issues in Docker

If you encounter browser-related issues:

```bash
# Use the Docker-specific config
docker run --rm \
  -v $(pwd):/app \
  mcr.microsoft.com/playwright:v1.54.1-jammy \
  npm test -- --config=playwright.config.docker.ts
```

### Permission Issues

```bash
# Fix permissions
docker run --rm -v $(pwd):/app alpine chmod -R 755 /app/test-results
```

### VNC Access (Headed Mode)

1. Start headed service:
   ```bash
   npm run docker:test:headed
   ```

2. Connect to VNC:
   - Server: `localhost:5900`
   - Password: Usually not required

## Performance Optimization

### For CI/CD

```bash
# Use specific browser only
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  blazedemo-playwright \
  npm test -- --project=chromium

# Parallel execution
docker run --rm \
  -e CI=true \
  -v $(pwd)/test-results:/app/test-results \
  blazedemo-playwright \
  npm test -- --workers=2
```

### Resource Limits

```yaml
# docker-compose.yml
services:
  playwright-tests:
    # ... other config
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Playwright tests in Docker
        run: |
          docker build -t playwright-tests .
          docker run --rm \
            -v ${{ github.workspace }}/test-results:/app/test-results \
            playwright-tests
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: test-results/
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                script {
                    docker.build('playwright-tests').inside {
                        sh 'npm test'
                    }
                }
            }
        }
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'test-results',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}
```

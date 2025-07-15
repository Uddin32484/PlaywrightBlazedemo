# BlazDemo Flight Booking - Playwright Testing Framework

A comprehensive Playwright testing framework for automated testing of the BlazDemo flight booking website with TypeScript, Page Object Model, mobile device support, Docker containerization, and screenshot functionality.

## 🏷️ Status Badges

[![Playwright Tests](https://github.com/Uddin32484/PlaywrightBlazedemo/actions/workflows/playwright.yml/badge.svg)](https://github.com/Uddin32484/PlaywrightBlazedemo/actions/workflows/playwright.yml)
[![Quick Tests](https://github.com/Uddin32484/PlaywrightBlazedemo/actions/workflows/quick-tests.yml/badge.svg)](https://github.com/Uddin32484/PlaywrightBlazedemo/actions/workflows/quick-tests.yml)
[![Regression Tests](https://github.com/Uddin32484/PlaywrightBlazedemo/actions/workflows/regression.yml/badge.svg)](https://github.com/Uddin32484/PlaywrightBlazedemo/actions/workflows/regression.yml)

## 🚀 Features

- **TypeScript Support**: Full TypeScript implementation with type safety
- **Page Object Model**: Clean, maintainable test architecture
- **Mobile Device Testing**: Support for 18+ mobile devices (Android & iOS)
- **Docker Support**: Containerized testing environment
- **Screenshot Functionality**: Comprehensive visual evidence capture
- **Cross-Browser Testing**: Chrome, Firefox, Safari (WebKit)
- **HTML Reports**: Detailed test reports with screenshots
- **Test Fixtures**: Reusable test data and configurations

## 🏗️ Project Structure

```
├── src/
│   ├── pages/           # Page Object Model classes
│   ├── types/           # TypeScript type definitions
│   ├── data/            # Test data
│   ├── fixtures/        # Test fixtures
│   └── utils/           # Utility classes (ScreenshotHelper)
├── tests/               # Test specifications
├── docker-compose.yml   # Docker configuration
├── Dockerfile          # Docker image definition
└── playwright.config.ts # Playwright configuration
```

## 📱 Supported Devices

### Mobile Browsers
- Mobile Chrome
- Mobile Safari

### Android Devices
- Pixel 7
- Galaxy S8+
- Galaxy S9+
- Galaxy Tab S4
- Galaxy Note 3

### iOS Devices
- iPhone 13, 14, 15 Series
- iPad Pro (11-inch & 12.9-inch)
- iPad Mini

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd BlazedemoFlight
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install Playwright browsers:**
```bash
npx playwright install
```

## 🚀 Running Tests

### Local Testing
```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run screenshot tests
npm run test:screenshot

# Run tests with UI mode
npm run test:ui

# Run mobile device tests
npm run test:mobile
```

### Docker Testing
```bash
# Build and run tests in Docker
docker-compose up playwright-tests

# Run headed tests with VNC
docker-compose up playwright-headed

# Start report server
docker-compose up report-server
```

## 📊 Test Reports

### HTML Reports
After running tests, view the HTML report:
```bash
npx playwright show-report
```

### Docker Reports
Access reports at `http://localhost:9323` when using Docker.

## 🚀 GitHub Actions CI/CD

This project includes comprehensive GitHub Actions workflows for automated testing:

### Available Workflows

1. **Playwright Tests** (`playwright.yml`)
   - Runs on push to main/develop branches
   - Tests across all browsers (Chrome, Firefox, Safari)
   - Includes mobile device testing
   - Generates HTML reports and screenshots
   - Publishes results to GitHub Pages

2. **Quick Tests** (`quick-tests.yml`)  
   - Fast feedback for feature branches
   - Runs smoke tests on Chromium only
   - Triggered on push to feature/* and fix/* branches

3. **Nightly Regression Tests** (`regression.yml`)
   - Comprehensive testing suite
   - Runs daily at 2 AM UTC
   - Includes Docker container testing
   - Auto-creates issues on failure

4. **Deploy Test Reports** (`deploy-reports.yml`)
   - Automatically deploys HTML reports to GitHub Pages
   - Accessible at `https://[username].github.io/[repo-name]`

### Manual Workflow Triggers

You can manually trigger workflows with custom parameters:

```bash
# Trigger main workflow with specific test suite
gh workflow run playwright.yml -f test_suite=smoke -f browser=chromium

# Run full regression suite
gh workflow run regression.yml -f full_suite=true
```

### Setting Up GitHub Actions

1. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Select "GitHub Actions" as source
   - Reports will be available at your GitHub Pages URL

2. **Configure Secrets (if needed):**
   ```bash
   # For advanced integrations
   SLACK_WEBHOOK_URL     # Slack notifications
   TEAMS_WEBHOOK_URL     # Teams notifications  
   EMAIL_API_KEY         # Email notifications
   ```

3. **Branch Protection Rules:**
   - Require status checks from "Quick Tests" 
   - Require up-to-date branches before merging

### Workflow Features

- ✅ **Cross-browser testing** (Chrome, Firefox, Safari)
- 📱 **Mobile device testing** (Android & iOS)
- 🐳 **Docker container validation**
- 📸 **Screenshot capture and comparison**
- 📊 **HTML report generation**
- 🔄 **Automatic retry on flaky tests**
- 📝 **Test result comments on PRs**
- 🚨 **Automatic issue creation on failures**
- 📈 **Test result trending and analytics**

### Reports and Artifacts

All workflows upload the following artifacts:
- HTML test reports (30-day retention)
- Screenshots (30-day retention)
- Test results JSON (30-day retention)
- Video recordings of failures

Access reports via:
- GitHub Actions artifacts
- GitHub Pages (for main branch)
- PR comments (automatic links)

## 📸 Screenshot Features

- **Automatic Screenshots**: Captured at key test steps
- **Failure Screenshots**: Automatic capture on test failures
- **Mobile Screenshots**: Device-specific screenshot capture
- **HTML Integration**: Screenshots embedded in HTML reports

## 🧪 Test Scenarios

1. **Complete Booking Flow**: End-to-end flight booking validation
2. **Mobile Device Testing**: Cross-device compatibility testing
3. **Screenshot Documentation**: Visual evidence collection
4. **Edge Case Testing**: Error handling and validation
5. **Final Amount Validation**: Price verification ($555 USD)

## 🔧 Configuration

### Playwright Config
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile device emulation
- Screenshot configuration
- Retry logic and timeouts

### Docker Config
- Multi-service architecture
- Volume mounting for reports
- Network isolation
- VNC support for headed testing

## 📝 Test Data

The framework validates:
- **Flight Routes**: Boston → Berlin
- **Passenger Details**: John Doe booking information
- **Payment Processing**: Credit card form validation
- **Final Amount**: $555 USD confirmation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is for educational and testing purposes.

## 🔗 Related

- [Playwright Documentation](https://playwright.dev/)
- [BlazDemo Website](https://blazedemo.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

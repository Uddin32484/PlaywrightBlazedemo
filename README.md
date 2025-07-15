# BlazDemo Flight Booking - Playwright Testing Framework

A comprehensive Playwright testing framework for automated testing of the BlazDemo flight booking website with TypeScript, Page Object Model, mobile device support, Docker containerization, and screenshot functionality.

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

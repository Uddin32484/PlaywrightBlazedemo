import { test, expect } from '../src/fixtures/testFixtures';
import { FlightDetails } from '../src/types';

test.describe('BlazDemo Flight Booking Tests', () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.homePage.navigateToHomePage();
  });

  test('Complete flight booking flow and validate final amount', async ({ 
    pageManager, 
    searchData, 
    customerData, 
    expectedResult 
  }) => {
    // Step 1: Navigate to home page and verify it's loaded
    await test.step('Verify home page is loaded', async () => {
      const isLoaded = await pageManager.homePage.verifyPageLoaded();
      expect(isLoaded).toBeTruthy();
      
      const title = await pageManager.homePage.getTitle();
      expect(title).toBe('BlazeDemo');
    });

    // Step 2: Search for flights
    let selectedFlight: FlightDetails;
    await test.step('Search for flights from Paris to Rome', async () => {
      await pageManager.homePage.searchFlights(searchData);
      
      // Verify flight results page is loaded
      const isLoaded = await pageManager.flightResultsPage.verifyPageLoaded();
      expect(isLoaded).toBeTruthy();
      
      const heading = await pageManager.flightResultsPage.getPageHeading();
      expect(heading).toContain('Flights from Paris to Rome');
    });

    // Step 3: Select the cheapest flight
    await test.step('Select the cheapest available flight', async () => {
      const flightCount = await pageManager.flightResultsPage.getFlightCount();
      expect(flightCount).toBeGreaterThan(0);
      
      selectedFlight = await pageManager.flightResultsPage.selectCheapestFlight();
      expect(selectedFlight).toBeDefined();
      expect(selectedFlight.price).toBeTruthy();
      
      console.log(`Selected cheapest flight: ${selectedFlight.airline} - ${selectedFlight.price}`);
    });

    // Step 4: Verify purchase page and get flight info
    let purchasePageInfo: any;
    await test.step('Verify purchase page and get booking details', async () => {
      const isLoaded = await pageManager.purchasePage.verifyPageLoaded();
      expect(isLoaded).toBeTruthy();
      
      purchasePageInfo = await pageManager.purchasePage.getFlightInfo();
      expect(purchasePageInfo.totalCost).toBeTruthy();
      
      console.log('Purchase page flight info:', purchasePageInfo);
    });

    // Step 5: Fill booking form and complete purchase
    await test.step('Complete booking form and purchase flight', async () => {
      await pageManager.purchasePage.completePurchase(customerData);
    });

    // Step 6: Verify confirmation page and validate final amount
    await test.step('Verify booking confirmation and validate final amount', async () => {
      const isLoaded = await pageManager.confirmationPage.verifyPageLoaded();
      expect(isLoaded).toBeTruthy();
      
      const bookingSuccess = await pageManager.confirmationPage.verifyBookingSuccess();
      expect(bookingSuccess).toBeTruthy();
      
      // Get booking confirmation details
      const confirmation = await pageManager.confirmationPage.getBookingConfirmation();
      expect(confirmation.id).toBeTruthy();
      expect(confirmation.status).toBe(expectedResult.status);
      expect(confirmation.currency).toBe(expectedResult.currency);
      
      // Validate the final amount
      const finalAmount = await pageManager.confirmationPage.getFinalAmount();
      expect(finalAmount).toBe(expectedResult.expectedAmount);
      
      console.log(`✅ Booking completed successfully!`);
      console.log(`Transaction ID: ${confirmation.id}`);
      console.log(`Final Amount: ${finalAmount} ${confirmation.currency}`);
      console.log(`Status: ${confirmation.status}`);
      console.log(`Auth Code: ${confirmation.authCode}`);
    });

    // Step 7: Additional validations
    await test.step('Perform additional validations', async () => {
      const transactionId = await pageManager.confirmationPage.getTransactionId();
      expect(transactionId).toMatch(/^\d+$/); // Should be numeric
      
      const authCode = await pageManager.confirmationPage.getAuthCode();
      expect(authCode).toBeTruthy();
      
      // Verify JSON response contains expected data
      const jsonResponse = await pageManager.confirmationPage.getJsonResponse();
      if (jsonResponse) {
        expect(jsonResponse.amount).toBe(expectedResult.expectedAmount);
        expect(jsonResponse.status).toBe(expectedResult.status);
        expect(jsonResponse.currency).toBe(expectedResult.currency);
      }
    });
  });

  test('Verify flight search functionality', async ({ pageManager, searchData }) => {
    await test.step('Verify flight search with different routes', async () => {
      // Test departure city options
      const departureCities = await pageManager.homePage.getDepartureCityOptions();
      expect(departureCities.length).toBeGreaterThan(0);
      expect(departureCities).toContain(searchData.departureCity);
      
      // Test destination city options  
      const destinationCities = await pageManager.homePage.getDestinationCityOptions();
      expect(destinationCities.length).toBeGreaterThan(0);
      expect(destinationCities).toContain(searchData.destinationCity);
    });
  });

  test('Verify flight results page functionality', async ({ pageManager, searchData }) => {
    await test.step('Search flights and verify results', async () => {
      await pageManager.homePage.searchFlights(searchData);
      
      const flights = await pageManager.flightResultsPage.getAllFlightDetails();
      expect(flights.length).toBeGreaterThan(0);
      
      // Verify each flight has required data
      flights.forEach(flight => {
        expect(flight.flightNumber).toBeTruthy();
        expect(flight.airline).toBeTruthy();
        expect(flight.price).toMatch(/\$\d+\.\d{2}/);
      });
      
      // Test cheapest flight selection
      const cheapest = await pageManager.flightResultsPage.getCheapestFlight();
      expect(cheapest.index).toBeGreaterThanOrEqual(0);
      expect(cheapest.flight.price).toBeTruthy();
    });
  });

  test('Verify booking form validation', async ({ pageManager, searchData, customerData }) => {
    await test.step('Navigate to purchase page', async () => {
      await pageManager.homePage.searchFlights(searchData);
      await pageManager.flightResultsPage.selectCheapestFlight();
    });

    await test.step('Test form field validations', async () => {
      // Fill partial form to test validation
      await pageManager.purchasePage.fillBookingForm({
        ...customerData,
        creditCardNumber: '1234' // Invalid card number
      });
      
      // Note: BlazeDemo might not have client-side validation,
      // but we can still verify the form accepts the data
      const errors = await pageManager.purchasePage.getFormValidationErrors();
      // This is more for demonstration - actual validation would depend on the site
    });
  });
});

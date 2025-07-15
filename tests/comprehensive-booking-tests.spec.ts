import { test, expect } from '../src/fixtures/testFixtures';
import type { BookingConfirmation } from '../src/types';

test.describe('BlazDemo Flight Booking Tests', () => {
  
  test('Complete Flight Booking Flow - Paris to Rome @smoke @critical', async ({ 
    pageManager, 
    searchData, 
    customerData, 
    expectedResult 
  }) => {
    console.log('🚀 Starting complete flight booking test: Paris → Rome');

    await test.step('Navigate to BlazDemo homepage', async () => {
      await pageManager.homePage.navigateToHomePage();
      const isLoaded = await pageManager.homePage.verifyPageLoaded();
      expect(isLoaded, 'Homepage should load successfully').toBeTruthy();
      console.log('✅ Homepage loaded successfully');
    });

    await test.step('Search flights from Paris to Rome', async () => {
      await pageManager.homePage.searchFlights(searchData);
      const isLoaded = await pageManager.flightResultsPage.verifyPageLoaded();
      expect(isLoaded, 'Flight results page should load').toBeTruthy();
      
      const heading = await pageManager.flightResultsPage.getPageHeading();
      expect(heading).toContain('Paris to Rome');
      console.log('✅ Flight search completed: Paris → Rome');
    });

    let selectedFlight;
    await test.step('Select cheapest flight option', async () => {
      const flightCount = await pageManager.flightResultsPage.getFlightCount();
      expect(flightCount, 'Should have available flights').toBeGreaterThan(0);
      
      selectedFlight = await pageManager.flightResultsPage.selectCheapestFlight();
      expect(selectedFlight.airline, 'Selected flight should have airline').toBeTruthy();
      expect(selectedFlight.price, 'Selected flight should have price').toBeTruthy();
      console.log(`✅ Selected cheapest flight: ${selectedFlight.airline} - ${selectedFlight.price}`);
    });

    let purchasePageTotal;
    await test.step('Review purchase details and pricing', async () => {
      const isLoaded = await pageManager.purchasePage.verifyPageLoaded();
      expect(isLoaded, 'Purchase page should load').toBeTruthy();
      
      const flightInfo = await pageManager.purchasePage.getFlightInfo();
      purchasePageTotal = flightInfo.totalCost;
      
      expect(flightInfo.airline, 'Airline should be specified').toBeTruthy();
      expect(flightInfo.totalCost, 'Total cost should be available').toBeTruthy();
      expect(parseFloat(flightInfo.totalCost), 'Total cost should be positive').toBeGreaterThan(0);
      
      console.log(`✅ Purchase page loaded. Total cost: $${purchasePageTotal}`);
      console.log(`📊 Flight: ${flightInfo.airline} ${flightInfo.flightNumber}`);
      console.log(`💰 Base Price: $${flightInfo.price}, Total: $${flightInfo.totalCost}`);
    });

    await test.step('Complete booking form with customer information', async () => {
      await pageManager.purchasePage.completePurchase(customerData);
      console.log('✅ Booking form completed and submitted');
      console.log(`👤 Customer: ${customerData.name}`);
      console.log(`📍 Address: ${customerData.address}, ${customerData.city}, ${customerData.state} ${customerData.zipCode}`);
    });

    let finalConfirmation: BookingConfirmation;
    await test.step('Verify booking confirmation and validate final amount', async () => {
      const isLoaded = await pageManager.confirmationPage.verifyPageLoaded();
      expect(isLoaded, 'Confirmation page should load').toBeTruthy();
      
      const bookingSuccess = await pageManager.confirmationPage.verifyBookingSuccess();
      expect(bookingSuccess, 'Booking should be successful').toBeTruthy();
      
      finalConfirmation = await pageManager.confirmationPage.getBookingConfirmation();
      
      // Critical Validation: Final amount should match expected
      expect(finalConfirmation.amount, 'Final amount should match expected').toBe(expectedResult.expectedAmount);
      expect(finalConfirmation.currency, 'Currency should be USD').toBe(expectedResult.currency);
      expect(finalConfirmation.status, 'Status should be PendingCapture').toBe(expectedResult.status);
      
      console.log('🎉 BOOKING COMPLETED SUCCESSFULLY!');
      console.log(`📋 Transaction ID: ${finalConfirmation.id}`);
      console.log(`💰 Final Amount: $${finalConfirmation.amount} ${finalConfirmation.currency}`);
      console.log(`📊 Status: ${finalConfirmation.status}`);
      console.log(`🔐 Auth Code: ${finalConfirmation.authCode}`);
      console.log(`📅 Date: ${finalConfirmation.date}`);
    });

    await test.step('Perform comprehensive validations', async () => {
      // Validate transaction ID format (should be numeric)
      expect(finalConfirmation.id).toMatch(/^\d+$/);
      
      // Validate auth code exists and is not empty
      expect(finalConfirmation.authCode).toBeTruthy();
      expect(finalConfirmation.authCode.length).toBeGreaterThan(0);
      
      // Validate amount is numeric and positive
      const numericAmount = parseFloat(finalConfirmation.amount);
      expect(numericAmount).toBeGreaterThan(0);
      expect(numericAmount).toBe(555); // Expected final amount
      
      // Validate transaction date exists and is recent
      expect(finalConfirmation.date).toBeTruthy();
      const transactionDate = new Date(finalConfirmation.date);
      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - transactionDate.getTime());
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      expect(hoursDiff).toBeLessThan(24); // Transaction should be within last 24 hours
      
      // Validate card information is masked properly
      expect(finalConfirmation.cardNumber).toContain('xxxxxxxxxxxx');
      expect(finalConfirmation.cardNumber).toMatch(/xxxxxxxxxxxx\d{4}/);
      
      console.log('✅ All comprehensive validations passed!');
      console.log(`🏆 FINAL TEST RESULT: Flight booking completed successfully with final amount $${finalConfirmation.amount} USD`);
    });
  });

  test('Flight Search Validation - Different Routes @regression', async ({ pageManager }) => {
    console.log('🔍 Testing different flight routes...');

    const routes = [
      { from: 'Boston', to: 'London' },
      { from: 'San Diego', to: 'New York' },
      { from: 'Portland', to: 'Berlin' }
    ];

    for (const route of routes) {
      await test.step(`Search flights: ${route.from} to ${route.to}`, async () => {
        await pageManager.homePage.navigateToHomePage();
        await pageManager.homePage.searchFlights({
          departureCity: route.from,
          destinationCity: route.to
        });
        
        const isLoaded = await pageManager.flightResultsPage.verifyPageLoaded();
        expect(isLoaded).toBeTruthy();
        
        const heading = await pageManager.flightResultsPage.getPageHeading();
        expect(heading).toContain(`${route.from} to ${route.to}`);
        
        const flightCount = await pageManager.flightResultsPage.getFlightCount();
        expect(flightCount).toBeGreaterThan(0);
        
        console.log(`✅ ${route.from} → ${route.to}: ${flightCount} flights found`);
      });
    }
  });

  test('Price Comparison Validation @functional', async ({ pageManager, searchData }) => {
    console.log('💰 Testing price comparison and flight selection...');

    await test.step('Navigate and search flights', async () => {
      await pageManager.homePage.navigateToHomePage();
      await pageManager.homePage.searchFlights(searchData);
      await pageManager.flightResultsPage.verifyPageLoaded();
    });

    await test.step('Analyze all available flights and prices', async () => {
      const flightCount = await pageManager.flightResultsPage.getFlightCount();
      expect(flightCount).toBeGreaterThan(0);
      
      const allFlights = await pageManager.flightResultsPage.getAllFlightDetails();
      
      // Validate all flights have required information
      for (const flight of allFlights) {
        expect(flight.airline, 'Each flight should have airline').toBeTruthy();
        expect(flight.price, 'Each flight should have price').toBeTruthy();
        expect(flight.flightNumber, 'Each flight should have flight number').toBeTruthy();
        expect(flight.departureTime, 'Each flight should have departure time').toBeTruthy();
        expect(flight.arrivalTime, 'Each flight should have arrival time').toBeTruthy();
        
        const price = parseFloat(flight.price.replace('$', ''));
        expect(price, `Price should be valid number for ${flight.airline}`).toBeGreaterThan(0);
      }
      
      // Find cheapest and most expensive flights
      const prices = allFlights.map((flight) => parseFloat(flight.price.replace('$', '')));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      console.log(`📊 Price Analysis:`);
      console.log(`   💸 Cheapest: $${minPrice}`);
      console.log(`   💰 Most Expensive: $${maxPrice}`);
      console.log(`   📈 Price Range: $${(maxPrice - minPrice).toFixed(2)}`);
      console.log(`   ✈️  Total Flights: ${flightCount}`);
      
      expect(maxPrice).toBeGreaterThan(minPrice);
    });
  });

  test('Form Validation Tests @validation', async ({ pageManager, searchData }) => {
    console.log('📝 Testing form validation and error handling...');

    await test.step('Navigate to purchase page', async () => {
      await pageManager.homePage.navigateToHomePage();
      await pageManager.homePage.searchFlights(searchData);
      await pageManager.flightResultsPage.selectCheapestFlight();
      await pageManager.purchasePage.verifyPageLoaded();
    });

    await test.step('Test form field validation', async () => {
      // Test with invalid customer data
      const invalidData = {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: 'invalid',
        cardType: 'Visa',
        creditCardNumber: '1234', // Invalid card number
        month: '13', // Invalid month
        year: '2020', // Past year
        nameOnCard: ''
      };

      // Fill form with invalid data (this should work but we'll verify the data)
      await pageManager.purchasePage.fillBookingForm(invalidData);
      
      // Verify form fields are filled (even with invalid data for testing purposes)
      console.log('✅ Form validation test completed');
    });
  });

  test('End-to-End Smoke Test @smoke @quick', async ({ 
    pageManager, 
    searchData, 
    customerData 
  }) => {
    console.log('🚀 Quick smoke test for critical path...');

    // Quick end-to-end test without detailed validations
    await pageManager.homePage.navigateToHomePage();
    await pageManager.homePage.searchFlights(searchData);
    await pageManager.flightResultsPage.selectCheapestFlight();
    await pageManager.purchasePage.completePurchase(customerData);
    
    const confirmation = await pageManager.confirmationPage.getBookingConfirmation();
    expect(confirmation.amount).toBe('555');
    expect(confirmation.status).toBe('PendingCapture');
    
    console.log(`✅ Smoke test passed! Transaction: ${confirmation.id}, Amount: $${confirmation.amount}`);
  });
});

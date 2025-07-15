import { test, expect } from '../src/fixtures/testFixtures';
import type { BookingConfirmation } from '../src/types';


test.describe('BlazDemo Complete Booking Validation', () => {
  test('MAIN TEST: End-to-end flight booking with amount validation @smoke', async ({ 
    pageManager, 
    searchData, 
    customerData, 
    expectedResult 
  }) => {
    // This is the main test that replicates our manual scenario
    console.log('🚀 Starting complete flight booking test...');

    await test.step('1. Navigate to BlazDemo homepage', async () => {
      await pageManager.homePage.navigateToHomePage();
      const isLoaded = await pageManager.homePage.verifyPageLoaded();
      expect(isLoaded, 'Homepage should load successfully').toBeTruthy();
      console.log('✅ Homepage loaded successfully');
    });

    await test.step('2. Search flights: Paris → Rome', async () => {
      await pageManager.homePage.searchFlights(searchData);
      const isLoaded = await pageManager.flightResultsPage.verifyPageLoaded();
      expect(isLoaded, 'Flight results page should load').toBeTruthy();
      
      const heading = await pageManager.flightResultsPage.getPageHeading();
      expect(heading).toContain('Paris to Rome');
      console.log('✅ Flight search completed: Paris → Rome');
    });

    let selectedFlight;
    await test.step('3. Select cheapest flight option', async () => {
      const flightCount = await pageManager.flightResultsPage.getFlightCount();
      expect(flightCount, 'Should have available flights').toBeGreaterThan(0);
      
      selectedFlight = await pageManager.flightResultsPage.selectCheapestFlight();
      console.log(`✅ Selected cheapest flight: ${selectedFlight.airline} - ${selectedFlight.price}`);
    });

    let purchasePageTotal;
    await test.step('4. Review purchase details', async () => {
      const isLoaded = await pageManager.purchasePage.verifyPageLoaded();
      expect(isLoaded, 'Purchase page should load').toBeTruthy();
      
      const flightInfo = await pageManager.purchasePage.getFlightInfo();
      purchasePageTotal = flightInfo.totalCost;
      
      expect(flightInfo.airline, 'Airline should be specified').toBeTruthy();
      expect(flightInfo.totalCost, 'Total cost should be available').toBeTruthy();
      
      console.log(`✅ Purchase page loaded. Total cost: ${purchasePageTotal}`);
    });

    await test.step('5. Complete booking form with customer data', async () => {
      await pageManager.purchasePage.completePurchase(customerData);
      console.log('✅ Booking form completed and submitted');
    });

    let finalConfirmation: BookingConfirmation;
    await test.step('6. Verify booking confirmation and final amount', async () => {
      const isLoaded = await pageManager.confirmationPage.verifyPageLoaded();
      expect(isLoaded, 'Confirmation page should load').toBeTruthy();
      
      const bookingSuccess = await pageManager.confirmationPage.verifyBookingSuccess();
      expect(bookingSuccess, 'Booking should be successful').toBeTruthy();
      
      finalConfirmation = await pageManager.confirmationPage.getBookingConfirmation();
      
      // Main validation: Check the final amount
      expect(finalConfirmation.amount, 'Final amount should match expected').toBe(expectedResult.expectedAmount);
      expect(finalConfirmation.currency, 'Currency should be USD').toBe(expectedResult.currency);
      expect(finalConfirmation.status, 'Status should be PendingCapture').toBe(expectedResult.status);
      
      console.log('🎉 BOOKING COMPLETED SUCCESSFULLY!');
      console.log(`📋 Transaction ID: ${finalConfirmation.id}`);
      console.log(`💰 Final Amount: ${finalConfirmation.amount} ${finalConfirmation.currency}`);
      console.log(`📊 Status: ${finalConfirmation.status}`);
      console.log(`🔐 Auth Code: ${finalConfirmation.authCode}`);
    });

    await test.step('7. Final validations and assertions', async () => {
      // Validate transaction ID format
      expect(finalConfirmation.id).toMatch(/^\d+$/);
      
      // Validate auth code exists
      expect(finalConfirmation.authCode).toBeTruthy();
      
      // Validate amount is numeric and positive
      const numericAmount = parseFloat(finalConfirmation.amount);
      expect(numericAmount).toBeGreaterThan(0);
      
      // Check transaction date
      expect(finalConfirmation.date).toBeTruthy();
      
      console.log('✅ All validations passed!');
      console.log(`🏆 TEST RESULT: Flight booking completed with final amount $${finalConfirmation.amount} USD`);
    });
  });
});

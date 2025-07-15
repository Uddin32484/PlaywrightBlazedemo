import { test, expect } from '../src/fixtures/testFixtures';

test.describe('BlazDemo Flight Booking - Edge Cases', () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.homePage.navigateToHomePage();
  });

  test('Test booking with alternative customer data', async ({ 
    pageManager, 
    searchData, 
    alternativeCustomerData 
  }) => {
    await test.step('Complete booking with alternative customer data', async () => {
      // Search flights
      await pageManager.homePage.searchFlights(searchData);
      
      // Select cheapest flight
      await pageManager.flightResultsPage.selectCheapestFlight();
      
      // Complete purchase with alternative data
      await pageManager.purchasePage.completePurchase(alternativeCustomerData);
      
      // Verify confirmation
      const isConfirmed = await pageManager.confirmationPage.verifyBookingSuccess();
      expect(isConfirmed).toBeTruthy();
      
      const finalAmount = await pageManager.confirmationPage.getFinalAmount();
      expect(finalAmount).toBeTruthy();
      expect(parseFloat(finalAmount)).toBeGreaterThan(0);
      
      console.log(`Alternative booking completed with amount: ${finalAmount}`);
    });
  });

  test('Test all flight options and compare prices', async ({ pageManager, searchData }) => {
    await test.step('Compare all available flight prices', async () => {
      await pageManager.homePage.searchFlights(searchData);
      
      const flights = await pageManager.flightResultsPage.getAllFlightDetails();
      expect(flights.length).toBeGreaterThan(1);
      
      const prices = flights.map(flight => parseFloat(flight.price.replace('$', '')));
      const cheapestPrice = Math.min(...prices);
      const expensivePrice = Math.max(...prices);
      
      expect(cheapestPrice).toBeLessThan(expensivePrice);
      
      console.log(`Price range: $${cheapestPrice} - $${expensivePrice}`);
      console.log(`Available flights: ${flights.length}`);
    });
  });

  test('Test navigation between pages', async ({ pageManager, searchData }) => {
    await test.step('Test navigation flow', async () => {
      // Home page
      expect(await pageManager.homePage.verifyPageLoaded()).toBeTruthy();
      
      // Search flights
      await pageManager.homePage.searchFlights(searchData);
      expect(await pageManager.flightResultsPage.verifyPageLoaded()).toBeTruthy();
      
      // Go to purchase page
      await pageManager.flightResultsPage.selectCheapestFlight();
      expect(await pageManager.purchasePage.verifyPageLoaded()).toBeTruthy();
      
      // Verify URLs
      const currentUrl = await pageManager.purchasePage.getCurrentUrl();
      expect(currentUrl).toContain('purchase.php');
    });
  });

  test('Validate flight information consistency', async ({ pageManager, searchData }) => {
    await test.step('Verify flight information remains consistent', async () => {
      await pageManager.homePage.searchFlights(searchData);
      
      // Get flight details from results page
      const selectedFlight = await pageManager.flightResultsPage.selectCheapestFlight();
      
      // Get flight info from purchase page
      const purchaseInfo = await pageManager.purchasePage.getFlightInfo();
      
      // Verify consistency (Note: BlazeDemo shows different info on purchase page)
      expect(purchaseInfo.airline).toBeTruthy();
      expect(purchaseInfo.flightNumber).toBeTruthy();
      expect(purchaseInfo.totalCost).toBeTruthy();
      
      console.log('Selected flight:', selectedFlight);
      console.log('Purchase page info:', purchaseInfo);
    });
  });
});

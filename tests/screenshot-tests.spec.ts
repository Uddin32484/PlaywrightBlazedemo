import { test, expect } from '../src/fixtures/testFixtures';
import type { BookingConfirmation } from '../src/types';

test.describe('BlazDemo Tests with Screenshots', () => {
  
  test('Complete Booking Flow with Screenshots @screenshot @smoke', async ({ 
    page,
    pageManager, 
    searchData, 
    customerData, 
    expectedResult 
  }) => {
    console.log('🚀 Starting booking test with comprehensive screenshots...');

    // Create screenshots directory
    await test.step('Setup screenshot directory', async () => {
      const fs = require('fs').promises;
      try {
        await fs.mkdir('test-results/screenshots', { recursive: true });
      } catch (error) {
        // Directory already exists
      }
    });

    await test.step('Navigate to homepage and take screenshot', async () => {
      await pageManager.homePage.navigateToHomePage();
      await pageManager.homePage.verifyPageLoaded();
      
      // Take homepage screenshot
      await page.screenshot({ 
        path: 'test-results/screenshots/01-homepage.png', 
        fullPage: true 
      });
      console.log('✅ Homepage screenshot captured');
    });

    await test.step('Search flights and capture results', async () => {
      await pageManager.homePage.searchFlights(searchData);
      await pageManager.flightResultsPage.verifyPageLoaded();
      
      // Take flight results screenshot
      await page.screenshot({ 
        path: 'test-results/screenshots/02-flight-results.png', 
        fullPage: true 
      });
      
      // Take screenshot of just the flights table
      const flightsTable = page.locator('table');
      await flightsTable.screenshot({ 
        path: 'test-results/screenshots/02a-flights-table.png' 
      });
      
      console.log('✅ Flight results screenshots captured');
    });

    let selectedFlight;
    await test.step('Select flight and capture selection', async () => {
      selectedFlight = await pageManager.flightResultsPage.selectCheapestFlight();
      
      // Take screenshot after selection (if any visual feedback)
      await page.screenshot({ 
        path: 'test-results/screenshots/03-flight-selected.png', 
        fullPage: true 
      });
      
      console.log(`✅ Selected flight: ${selectedFlight.airline} - ${selectedFlight.price}`);
    });

    await test.step('Purchase page and form screenshots', async () => {
      await pageManager.purchasePage.verifyPageLoaded();
      
      // Take initial purchase page screenshot
      await page.screenshot({ 
        path: 'test-results/screenshots/04-purchase-page-initial.png', 
        fullPage: true 
      });
      
      // Take screenshot of flight info section
      const flightInfoSection = page.locator('p:has-text("Airline:")').locator('..');
      await flightInfoSection.screenshot({ 
        path: 'test-results/screenshots/04a-flight-info.png' 
      });
      
      console.log('✅ Purchase page screenshots captured');
    });

    await test.step('Fill form and capture form completion', async () => {
      await pageManager.purchasePage.completePurchase(customerData);
      
      // Take screenshot just before submitting
      await page.screenshot({ 
        path: 'test-results/screenshots/05-form-completed.png', 
        fullPage: true 
      });
      
      console.log('✅ Form completion screenshot captured');
    });

    let finalConfirmation: BookingConfirmation;
    await test.step('Capture confirmation page with multiple screenshots', async () => {
      await pageManager.confirmationPage.verifyPageLoaded();
      
      // Get confirmation details
      finalConfirmation = await pageManager.confirmationPage.getBookingConfirmation();
      
      // Take comprehensive confirmation screenshots
      const evidence = await pageManager.confirmationPage.captureFullConfirmationEvidence('booking-success');
      
      // Additional specific screenshots
      await page.screenshot({ 
        path: 'test-results/screenshots/06-confirmation-page.png', 
        fullPage: true 
      });
      
      // Take screenshot of the success message
      const successMessage = page.locator('h1');
      await successMessage.screenshot({ 
        path: 'test-results/screenshots/06a-success-message.png' 
      });
      
      // Take screenshot of the confirmation table
      const confirmationTable = page.locator('table');
      await confirmationTable.screenshot({ 
        path: 'test-results/screenshots/06b-confirmation-table.png' 
      });
      
      // Take screenshot of the JSON response if visible
      const jsonResponse = page.locator('div').last();
      if (await jsonResponse.isVisible()) {
        await jsonResponse.screenshot({ 
          path: 'test-results/screenshots/06c-json-response.png' 
        });
      }
      
      console.log('🎉 BOOKING COMPLETED - All screenshots captured!');
      console.log(`📋 Transaction ID: ${finalConfirmation.id}`);
      console.log(`💰 Final Amount: $${finalConfirmation.amount} ${finalConfirmation.currency}`);
    });

    await test.step('Validate final results with evidence', async () => {
      // Main assertions
      expect(finalConfirmation.amount).toBe(expectedResult.expectedAmount);
      expect(finalConfirmation.currency).toBe(expectedResult.currency);
      expect(finalConfirmation.status).toBe(expectedResult.status);
      
      // Take a final "test passed" screenshot
      await page.screenshot({ 
        path: 'test-results/screenshots/07-test-completed.png', 
        fullPage: true 
      });
      
      console.log('✅ All validations passed with screenshot evidence!');
      console.log(`🏆 TEST RESULT: Booking completed with amount $${finalConfirmation.amount} USD`);
    });
  });

  test('Screenshot on Test Failure Demo @screenshot @demo', async ({ 
    page,
    pageManager, 
    searchData 
  }) => {
    console.log('📸 Demonstrating screenshot on failure...');

    await test.step('Navigate and search', async () => {
      await pageManager.homePage.navigateToHomePage();
      await pageManager.homePage.searchFlights(searchData);
    });

    await test.step('Intentional failure with screenshot', async () => {
      try {
        // This will fail intentionally
        await expect(page.locator('h1')).toHaveText('This Will Fail');
      } catch (error) {
        // Take screenshot on failure
        await page.screenshot({ 
          path: `test-results/screenshots/FAILURE-${Date.now()}.png`, 
          fullPage: true 
        });
        
        // Re-throw the error so the test fails properly
        throw error;
      }
    });
  });

  test('Multiple Screenshots During Test Steps @screenshot @detailed', async ({ 
    page,
    pageManager, 
    searchData, 
    customerData 
  }) => {
    console.log('📷 Taking screenshots at every major step...');

    const screenshots: string[] = [];

    await test.step('Step 1: Homepage', async () => {
      await pageManager.homePage.navigateToHomePage();
      const screenshotPath = `test-results/screenshots/step-01-homepage-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots.push(screenshotPath);
    });

    await test.step('Step 2: Flight Search', async () => {
      await pageManager.homePage.searchFlights(searchData);
      const screenshotPath = `test-results/screenshots/step-02-search-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots.push(screenshotPath);
    });

    await test.step('Step 3: Flight Selection', async () => {
      await pageManager.flightResultsPage.selectCheapestFlight();
      const screenshotPath = `test-results/screenshots/step-03-selection-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots.push(screenshotPath);
    });

    await test.step('Step 4: Purchase Form', async () => {
      await pageManager.purchasePage.verifyPageLoaded();
      const screenshotPath = `test-results/screenshots/step-04-purchase-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots.push(screenshotPath);
    });

    console.log(`📸 Captured ${screenshots.length} screenshots:`);
    screenshots.forEach((path, index) => {
      console.log(`   ${index + 1}. ${path}`);
    });
  });
});

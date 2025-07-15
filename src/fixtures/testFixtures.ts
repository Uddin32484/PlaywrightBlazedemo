import { test as base, Page } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { 
  flightSearchData, 
  bookingData, 
  expectedBookingResult,
  alternativeBookingData 
} from '../data/testData';
import { 
  FlightSearchData, 
  BookingData, 
  ExpectedBookingResult 
} from '../types';

type TestFixtures = {
  pageManager: PageManager;
  searchData: FlightSearchData;
  customerData: BookingData;
  alternativeCustomerData: BookingData;
  expectedResult: ExpectedBookingResult;
};

export const test = base.extend<TestFixtures>({
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
  },

  searchData: async ({}, use) => {
    await use(flightSearchData);
  },

  customerData: async ({}, use) => {
    await use(bookingData);
  },

  alternativeCustomerData: async ({}, use) => {
    await use(alternativeBookingData);
  },

  expectedResult: async ({}, use) => {
    await use(expectedBookingResult);
  },
});

export { expect } from '@playwright/test';

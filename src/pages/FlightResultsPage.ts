import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { FlightDetails } from '../types';

export class FlightResultsPage extends BasePage {
  private readonly pageHeading: Locator;
  private readonly flightTable: Locator;
  private readonly flightRows: Locator;
  private readonly chooseFlightButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h3');
    this.flightTable = page.locator('table');
    this.flightRows = page.locator('tbody tr');
    this.chooseFlightButtons = page.locator('input[value="Choose This Flight"]');
  }

  async verifyPageLoaded(): Promise<boolean> {
    await this.waitForLoadState();
    return await this.isVisible(this.pageHeading);
  }

  async getPageHeading(): Promise<string> {
    return await this.getText(this.pageHeading);
  }

  async getFlightCount(): Promise<number> {
    return await this.flightRows.count();
  }

  async getAllFlightDetails(): Promise<FlightDetails[]> {
    const flightCount = await this.getFlightCount();
    const flights: FlightDetails[] = [];

    for (let i = 0; i < flightCount; i++) {
      const row = this.flightRows.nth(i);
      const cells = row.locator('td');

      const flight: FlightDetails = {
        flightNumber: await cells.nth(1).textContent() || '',
        airline: await cells.nth(2).textContent() || '',
        departureTime: await cells.nth(3).textContent() || '',
        arrivalTime: await cells.nth(4).textContent() || '',
        price: await cells.nth(5).textContent() || ''
      };

      flights.push(flight);
    }

    return flights;
  }

  async getCheapestFlight(): Promise<{ index: number; flight: FlightDetails }> {
    const flights = await this.getAllFlightDetails();
    let cheapestIndex = 0;
    let cheapestPrice = parseFloat(flights[0].price.replace('$', ''));

    for (let i = 1; i < flights.length; i++) {
      const currentPrice = parseFloat(flights[i].price.replace('$', ''));
      if (currentPrice < cheapestPrice) {
        cheapestPrice = currentPrice;
        cheapestIndex = i;
      }
    }

    return {
      index: cheapestIndex,
      flight: flights[cheapestIndex]
    };
  }

  async selectFlight(index: number): Promise<void> {
    await this.chooseFlightButtons.nth(index).click();
    await this.waitForLoadState();
  }

  async selectCheapestFlight(): Promise<FlightDetails> {
    const cheapest = await this.getCheapestFlight();
    await this.selectFlight(cheapest.index);
    return cheapest.flight;
  }

  async getFlightPrice(index: number): Promise<string> {
    const row = this.flightRows.nth(index);
    const priceCell = row.locator('td').nth(5);
    return await this.getText(priceCell);
  }

  async getFlightAirline(index: number): Promise<string> {
    const row = this.flightRows.nth(index);
    const airlineCell = row.locator('td').nth(2);
    return await this.getText(airlineCell);
  }
}

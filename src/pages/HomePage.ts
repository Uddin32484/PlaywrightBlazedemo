import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { FlightSearchData } from '../types';

export class HomePage extends BasePage {
  private readonly departureCityDropdown: Locator;
  private readonly destinationCityDropdown: Locator;
  private readonly findFlightsButton: Locator;
  private readonly pageTitle: Locator;
  private readonly welcomeMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.departureCityDropdown = page.locator('select[name="fromPort"]');
    this.destinationCityDropdown = page.locator('select[name="toPort"]');
    this.findFlightsButton = page.locator('input[type="submit"]');
    this.pageTitle = page.locator('h1');
    this.welcomeMessage = page.locator('h1:has-text("Welcome to the Simple Travel Agency!")');
  }

  async navigateToHomePage(): Promise<void> {
    await this.goto('/');
    await this.waitForLoadState();
  }

  async verifyPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.welcomeMessage);
  }

  async selectDepartureCity(city: string): Promise<void> {
    await this.selectOption(this.departureCityDropdown, city);
  }

  async selectDestinationCity(city: string): Promise<void> {
    await this.selectOption(this.destinationCityDropdown, city);
  }

  async clickFindFlights(): Promise<void> {
    await this.clickButton(this.findFlightsButton);
    await this.waitForLoadState();
  }

  async searchFlights(searchData: FlightSearchData): Promise<void> {
    await this.selectDepartureCity(searchData.departureCity);
    await this.selectDestinationCity(searchData.destinationCity);
    await this.clickFindFlights();
  }

  async getSelectedDepartureCity(): Promise<string> {
    return await this.departureCityDropdown.inputValue();
  }

  async getSelectedDestinationCity(): Promise<string> {
    return await this.destinationCityDropdown.inputValue();
  }

  async getDepartureCityOptions(): Promise<string[]> {
    const options = await this.departureCityDropdown.locator('option').allTextContents();
    return options;
  }

  async getDestinationCityOptions(): Promise<string[]> {
    const options = await this.destinationCityDropdown.locator('option').allTextContents();
    return options;
  }
}

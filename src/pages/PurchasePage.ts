import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { BookingData } from '../types';

export class PurchasePage extends BasePage {
  private readonly pageHeading: Locator;
  private readonly flightInfo: Locator;
  private readonly totalCostElement: Locator;
  private readonly nameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly cardTypeDropdown: Locator;
  private readonly creditCardNumberInput: Locator;
  private readonly monthInput: Locator;
  private readonly yearInput: Locator;
  private readonly nameOnCardInput: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly purchaseFlightButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h2');
    this.flightInfo = page.locator('p');
    this.totalCostElement = page.locator('em');
    this.nameInput = page.locator('input[name="inputName"]');
    this.addressInput = page.locator('input[name="address"]');
    this.cityInput = page.locator('input[name="city"]');
    this.stateInput = page.locator('input[name="state"]');
    this.zipCodeInput = page.locator('input[name="zipCode"]');
    this.cardTypeDropdown = page.locator('select[name="cardType"]');
    this.creditCardNumberInput = page.locator('input[name="creditCardNumber"]');
    this.monthInput = page.locator('input[name="creditCardMonth"]');
    this.yearInput = page.locator('input[name="creditCardYear"]');
    this.nameOnCardInput = page.locator('input[name="nameOnCard"]');
    this.rememberMeCheckbox = page.locator('input[name="rememberMe"]');
    this.purchaseFlightButton = page.locator('input[type="submit"]');
  }

  async verifyPageLoaded(): Promise<boolean> {
    await this.waitForLoadState();
    return await this.isVisible(this.pageHeading);
  }

  async getPageHeading(): Promise<string> {
    return await this.getText(this.pageHeading);
  }

  async getTotalCost(): Promise<string> {
    return await this.getText(this.totalCostElement);
  }

  async getFlightInfo(): Promise<{
    airline: string;
    flightNumber: string;
    price: string;
    fees: string;
    totalCost: string;
  }> {
    const allParagraphs = await this.flightInfo.allTextContents();
    
    const airline = allParagraphs.find(p => p.includes('Airline:'))?.replace('Airline: ', '') || '';
    const flightNumber = allParagraphs.find(p => p.includes('Flight Number:'))?.replace('Flight Number: ', '') || '';
    const price = allParagraphs.find(p => p.includes('Price:'))?.replace('Price: ', '') || '';
    const fees = allParagraphs.find(p => p.includes('Arbitrary Fees and Taxes:'))?.replace('Arbitrary Fees and Taxes: ', '') || '';
    const totalCost = await this.getTotalCost();

    return {
      airline,
      flightNumber,
      price,
      fees,
      totalCost
    };
  }

  async fillBookingForm(bookingData: BookingData): Promise<void> {
    await this.fillInput(this.nameInput, bookingData.name);
    await this.fillInput(this.addressInput, bookingData.address);
    await this.fillInput(this.cityInput, bookingData.city);
    await this.fillInput(this.stateInput, bookingData.state);
    await this.fillInput(this.zipCodeInput, bookingData.zipCode);
    await this.selectOption(this.cardTypeDropdown, bookingData.cardType);
    await this.fillInput(this.creditCardNumberInput, bookingData.creditCardNumber);
    await this.fillInput(this.monthInput, bookingData.month);
    await this.fillInput(this.yearInput, bookingData.year);
    await this.fillInput(this.nameOnCardInput, bookingData.nameOnCard);
  }

  async checkRememberMe(): Promise<void> {
    if (!(await this.rememberMeCheckbox.isChecked())) {
      await this.rememberMeCheckbox.check();
    }
  }

  async clickPurchaseFlight(): Promise<void> {
    await this.clickButton(this.purchaseFlightButton);
    await this.waitForLoadState();
  }

  async completePurchase(bookingData: BookingData): Promise<void> {
    await this.fillBookingForm(bookingData);
    await this.clickPurchaseFlight();
  }

  async getFormValidationErrors(): Promise<string[]> {
    // Check for any validation error messages
    const errorElements = this.page.locator('.error, .validation-error, .alert-danger');
    return await errorElements.allTextContents();
  }
}

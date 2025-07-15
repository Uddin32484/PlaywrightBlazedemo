import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { BookingConfirmation } from '../types';

export class ConfirmationPage extends BasePage {
  private readonly pageHeading: Locator;
  private readonly confirmationTable: Locator;
  private readonly confirmationId: Locator;
  private readonly confirmationStatus: Locator;
  private readonly confirmationAmount: Locator;
  private readonly confirmationCardNumber: Locator;
  private readonly confirmationAuthCode: Locator;
  private readonly confirmationDate: Locator;
  private readonly jsonData: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h1');
    this.confirmationTable = page.locator('table');
    this.confirmationId = page.locator('tr:has-text("Id") td:nth-child(2)');
    this.confirmationStatus = page.locator('tr:has-text("Status") td:nth-child(2)');
    this.confirmationAmount = page.locator('tr:has-text("Amount") td:nth-child(2)');
    this.confirmationCardNumber = page.locator('tr:has-text("Card Number") td:nth-child(2)');
    this.confirmationAuthCode = page.locator('tr:has-text("Auth Code") td:nth-child(2)');
    this.confirmationDate = page.locator('tr:has-text("Date") td:nth-child(2)');
    this.jsonData = page.locator('pre').last();
  }

  async verifyPageLoaded(): Promise<boolean> {
    await this.waitForLoadState();
    return await this.isVisible(this.pageHeading);
  }

  async getPageHeading(): Promise<string> {
    return await this.getText(this.pageHeading);
  }

  async getBookingConfirmation(): Promise<BookingConfirmation> {
    const id = await this.getText(this.confirmationId);
    const status = await this.getText(this.confirmationStatus);
    const amount = await this.getText(this.confirmationAmount);
    const cardNumber = await this.getText(this.confirmationCardNumber);
    const authCode = await this.getText(this.confirmationAuthCode);
    const date = await this.getText(this.confirmationDate);

    // Extract amount and currency
    const amountMatch = amount.match(/(\d+(?:\.\d+)?)\s*([A-Z]{3})/);
    const finalAmount = amountMatch ? amountMatch[1] : amount.replace(/[^\d.]/g, '');
    const currency = amountMatch ? amountMatch[2] : 'USD';

    return {
      id: id.trim(),
      status: status.trim(),
      amount: finalAmount,
      currency: currency,
      cardNumber: cardNumber.trim(),
      authCode: authCode.trim(),
      date: date.trim()
    };
  }

  async getFinalAmount(): Promise<string> {
    const confirmation = await this.getBookingConfirmation();
    return confirmation.amount;
  }

  async getFinalAmountWithCurrency(): Promise<string> {
    const confirmation = await this.getBookingConfirmation();
    return `${confirmation.amount} ${confirmation.currency}`;
  }

  async getTransactionId(): Promise<string> {
    const confirmation = await this.getBookingConfirmation();
    return confirmation.id;
  }

  async getTransactionStatus(): Promise<string> {
    const confirmation = await this.getBookingConfirmation();
    return confirmation.status;
  }

  async getAuthCode(): Promise<string> {
    const confirmation = await this.getBookingConfirmation();
    return confirmation.authCode;
  }

  async getTransactionDate(): Promise<string> {
    const confirmation = await this.getBookingConfirmation();
    return confirmation.date;
  }

  async getJsonResponse(): Promise<any> {
    try {
      const jsonText = await this.getText(this.jsonData);
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return null;
    }
  }

  async verifyBookingSuccess(): Promise<boolean> {
    const heading = await this.getPageHeading();
    return heading.includes('Thank you for your purchase');
  }

  async getAllConfirmationDetails(): Promise<{
    heading: string;
    confirmation: BookingConfirmation;
    jsonResponse: any;
  }> {
    return {
      heading: await this.getPageHeading(),
      confirmation: await this.getBookingConfirmation(),
      jsonResponse: await this.getJsonResponse()
    };
  }

  // Screenshot methods specific to confirmation page
  async takeConfirmationScreenshot(testName?: string): Promise<Buffer> {
    const name = testName ? `confirmation-${testName}` : 'confirmation-page';
    return await this.takeScreenshot(name);
  }

  async takeConfirmationTableScreenshot(): Promise<Buffer> {
    return await this.takeElementScreenshot(this.confirmationTable, 'confirmation-table');
  }

  async takeSuccessMessageScreenshot(): Promise<Buffer> {
    return await this.takeElementScreenshot(this.pageHeading, 'success-message');
  }

  async captureFullConfirmationEvidence(testName: string): Promise<{
    fullPageScreenshot: Buffer;
    tableScreenshot: Buffer;
    confirmation: BookingConfirmation;
  }> {
    // Take multiple screenshots for comprehensive evidence
    const fullPageScreenshot = await this.takeConfirmationScreenshot(testName);
    const tableScreenshot = await this.takeConfirmationTableScreenshot();
    const confirmation = await this.getBookingConfirmation();

    return {
      fullPageScreenshot,
      tableScreenshot,
      confirmation
    };
  }
}

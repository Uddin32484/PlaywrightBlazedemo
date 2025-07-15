import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { FlightResultsPage } from './FlightResultsPage';
import { PurchasePage } from './PurchasePage';
import { ConfirmationPage } from './ConfirmationPage';

export class PageManager {
  private page: Page;
  public homePage: HomePage;
  public flightResultsPage: FlightResultsPage;
  public purchasePage: PurchasePage;
  public confirmationPage: ConfirmationPage;

  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(page);
    this.flightResultsPage = new FlightResultsPage(page);
    this.purchasePage = new PurchasePage(page);
    this.confirmationPage = new ConfirmationPage(page);
  }

  getPage(): Page {
    return this.page;
  }
}

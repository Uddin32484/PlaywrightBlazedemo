import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  protected async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  protected async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  protected async clickButton(locator: Locator): Promise<void> {
    await locator.click();
  }

  protected async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  protected async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  // Screenshot methods
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    return await this.page.screenshot({ 
      path: `test-results/screenshots/${screenshotName}.png`,
      fullPage: true 
    });
  }

  async takeElementScreenshot(locator: Locator, name?: string): Promise<Buffer> {
    const screenshotName = name || `element-screenshot-${Date.now()}`;
    return await locator.screenshot({ 
      path: `test-results/screenshots/${screenshotName}.png` 
    });
  }

  async takeScreenshotOnFailure(testName: string): Promise<void> {
    try {
      await this.takeScreenshot(`failure-${testName}-${Date.now()}`);
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }

  // Utility methods for testing
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async highlightElement(locator: Locator): Promise<void> {
    await locator.highlight();
  }

  async getPageSource(): Promise<string> {
    return await this.page.content();
  }

  async getAllText(): Promise<string> {
    return await this.page.textContent('body') || '';
  }

  async getViewportSize(): Promise<{ width: number; height: number } | null> {
    return await this.page.viewportSize();
  }
}

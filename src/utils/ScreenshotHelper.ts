import { Page, TestInfo } from '@playwright/test';

export class ScreenshotHelper {
  constructor(private page: Page, private testInfo: TestInfo) {}

  /**
   * Take a screenshot and attach it to the test report
   */
  async takeAndAttachScreenshot(name: string, options?: {
    fullPage?: boolean;
    animations?: 'disabled' | 'allow';
    clip?: { x: number; y: number; width: number; height: number };
  }): Promise<void> {
    const screenshot = await this.page.screenshot({
      fullPage: options?.fullPage ?? true,
      animations: options?.animations ?? 'disabled',
      clip: options?.clip,
    });

    await this.testInfo.attach(name, {
      body: screenshot,
      contentType: 'image/png',
    });
  }

  /**
   * Take element screenshot and attach it to the test report
   */
  async takeAndAttachElementScreenshot(
    selector: string, 
    name: string
  ): Promise<void> {
    const element = this.page.locator(selector);
    const screenshot = await element.screenshot();

    await this.testInfo.attach(name, {
      body: screenshot,
      contentType: 'image/png',
    });
  }

  /**
   * Compare screenshot with baseline
   */
  async compareScreenshot(name: string, options?: {
    fullPage?: boolean;
    animations?: 'disabled' | 'allow';
    threshold?: number;
  }): Promise<void> {
    await this.page.screenshot({
      fullPage: options?.fullPage ?? true,
      animations: options?.animations ?? 'disabled',
      path: `test-results/screenshots/${name}.png`,
    });

    // For visual comparison tests
    // expect(await this.page.screenshot()).toMatchSnapshot(`${name}.png`, {
    //   threshold: options?.threshold ?? 0.3
    // });
  }

  /**
   * Take screenshot on test failure
   */
  async takeFailureScreenshot(): Promise<void> {
    if (this.testInfo.status === 'failed') {
      const screenshot = await this.page.screenshot({
        fullPage: true,
        path: `test-results/screenshots/FAILURE-${this.testInfo.title}-${Date.now()}.png`,
      });

      await this.testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  }

  /**
   * Capture evidence for test step
   */
  async captureStepEvidence(stepName: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `${stepName}-${timestamp}`;
    
    await this.takeAndAttachScreenshot(screenshotName);
  }

  /**
   * Record video of the test
   */
  async attachVideo(): Promise<void> {
    const videoPath = await this.page.video()?.path();
    if (videoPath) {
      await this.testInfo.attach('video', {
        path: videoPath,
        contentType: 'video/webm',
      });
    }
  }

  /**
   * Capture network logs as text attachment
   */
  async captureNetworkLogs(): Promise<void> {
    // This would require setting up network listeners during test setup
    const logs = 'Network logs would go here';
    await this.testInfo.attach('network-logs', {
      body: logs,
      contentType: 'text/plain',
    });
  }

  /**
   * Capture browser console logs
   */
  async captureConsoleLogs(): Promise<void> {
    // This would require setting up console listeners during test setup
    const logs = 'Console logs would go here';
    await this.testInfo.attach('console-logs', {
      body: logs,
      contentType: 'text/plain',
    });
  }
}

/**
 * Test fixture for screenshot helper
 */
export const screenshotHelper = async ({ page }: { page: Page }, use: any, testInfo: TestInfo) => {
  const helper = new ScreenshotHelper(page, testInfo);
  await use(helper);
  
  // Automatically take screenshot on failure
  await helper.takeFailureScreenshot();
};

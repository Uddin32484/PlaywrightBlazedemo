const { test, expect } = require('@playwright/test');

test('demo test', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await expect(page).toHaveTitle(/React • TodoMVC/);
  
  // Create 1st todo.
  await page.locator('.new-todo').click();
  await page.locator('.new-todo').fill('buy some cheese');
  await page.locator('.new-todo').press('Enter');

  // Create 2nd todo.
  await page.locator('.new-todo').fill('feed the cat');
  await page.locator('.new-todo').press('Enter');

  // Check number of todos.
  await expect(page.locator('.todo-list li')).toHaveCount(2);
  
  // Check first todo.
  await expect(page.locator('.todo-list li').first()).toHaveText('buy some cheese');
  
  // Check second todo.
  await expect(page.locator('.todo-list li').nth(1)).toHaveText('feed the cat');
});

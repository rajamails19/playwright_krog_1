import { test } from '@playwright/test';

test('Sign in to Kroger', async ({ page }) => {
  // Add minimal stealth to avoid bot detection
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  // Try navigating to Kroger homepage
  await page.goto('https://www.kroger.com/', { waitUntil: 'domcontentloaded' });

  // Check if access denied or redirected to login
  if (page.url().includes('errors.edgesuite.net') || page.url().includes('login.kroger.com')) {
    // Fallback to direct login page navigation
    await page.goto('https://www.kroger.com/signin', { waitUntil: 'domcontentloaded' });
  } else {
    // Click Welcome button
    await page.getByTestId('WelcomeButtonDesktop').click();
    // Click Sign In button
    await page.getByTestId('WelcomeMenuButtonSignIn').click();
  }

  // Fill in login form
  await page.locator('#signInName').fill('r@gmail.com');
  await page.locator('#password').fill('r@gmail.com19');
 

  // Click sign in button
  await page.getByRole('button', { name: /sign in/i }).click();
  // await page.getByRole('button', { name: /sign in/i }).click({ timeout: 60000 }); // Increased timeout to 60 seconds
  await page.waitForURL('https://www.kroger.com/account/confirm/send')
  await page.getByRole('link', { name: 'Kroger logo' }).click();  
  await page.getByTestId('CurrentModality-button').click();
  await page.getByTestId('PostalCodeSearchBox-drawer').click();
  await page.getByTestId('PostalCodeSearchBox-input').click();
  await page.getByTestId('PostalCodeSearchBox-input').fill('38111');
  await page.getByTestId('PostalCodeSearchBox-Form').getByRole('button', { name: 'Search' }).click();
  await page.getByTestId('ModalityOption-Button-PICKUP').click();
  await page.getByTestId('SelectStore-02500488').click();
  await page.getByTestId('kds-Toast-closeButton').click();

  // Select all quantity steppers in the cart
const steppers = await page.locator('[data-testid="kds-QuantityStepper"]').elementHandles();

for (const stepper of steppers) {
  // Locate the decrement button within each stepper
  const decButton = await stepper.$('[data-testid="kds-QuantityStepper-decButton"]');
  const input = await stepper.$('[data-testid="kds-QuantityStepper-input"]');

  if (decButton && input) {
    // Continuously click decrement until quantity reaches zero or item is removed
    while (true) {
      const quantity = await input.getAttribute('value');
      if (!quantity || parseInt(quantity) <= 0) break;

      await decButton.click();
      await page.waitForTimeout(300); // slight delay for UI updates
    }
  }
}

  // **Search for grapes**
  await page.locator('#SearchBar-input').fill('grapes');

  await page.locator('svg.kds-Icon.kds-Icon--utilityMedium.kds-FormField-icon').click();

  await page.getByTestId('product-card-0').getByTestId('kds-QuantityStepper-ctaButton').click();
  // await page.getByTestId('product-card-2').getByTestId('kds-QuantityStepper-ctaButton').click();


  // **Click the basket icon**
  await page.locator('svg.kds-Icon.kds-Icon--utilityLarge.text-primary-inverse').click();

    await page.locator('svg.kds-Icon.kds-Icon--utilityLarge.text-primary-inverse').click();
  // }
  // **Click the "Check Out Pickup" button**
  await page.getByRole('button', { name: 'Check Out Pickup' }).click();

  // Conditionally click the "Continue to Checkout" button
  const continueToCheckoutButton = page.locator('button:has-text("Continue to Checkout")');
  if (await continueToCheckoutButton.isVisible()) {
    await continueToCheckoutButton.click();
    console.log('Clicked "Continue to Checkout" button.');
  } else {
    console.log('"Continue to Checkout" button not visible.');
  }

  // **Click the 3rd weekday slot**
  const weekdaySlots = page.locator('span.kds-Text--m.font-bold.text-center.text-accent-more-prominent.lh-40');
  await weekdaySlots.nth(2).click(); // nth(2) selects the third element (index 2)


  // **Scroll down the page**
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // **Click the 2nd last timeslot**
  const timeSlots = page.locator('label.kds-Label.kds-Label--hasRadioOrCheckbox.block.max-w-full.extend-label-to-full-card.p-16.kds-Text--m');
  const timeSlotsCount = await timeSlots.count();
  if (timeSlotsCount >= 2) {
    await timeSlots.nth(timeSlotsCount - 2).click();
    console.log(`Clicked the 2nd last timeslot.`);
  } else if (timeSlotsCount === 1) {
    await timeSlots.nth(0).click();
    console.log(`Clicked the only timeslot.`);
  } else {
    console.log(`Less than two timeslots found.`);
  }

  // **Scroll up the page**
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // **Click the "Continue" button**
  await page.locator('button[data-qa="scheduling-page/quote-selection-form"][data-testid="scheduling-page/quote-selection-form"]').click();


  await page.pause();

});

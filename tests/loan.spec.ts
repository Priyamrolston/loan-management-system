import { test, expect } from '@playwright/test';

test.describe('Loan Application E2E Workflow', () => {
  test('Complete Personal Loan Workflow', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:5173');

    // Step 1: Personal Info
    await expect(page.locator('h2')).toContainText('Personal Info');
    await page.fill('input[name="fullName"]', 'Jane Doe');
    await page.fill('input[type="email"]', 'jane.doe@example.com');
    await page.fill('input[name="mobile"]', '9876543210');
    
    // Fill PAN and Aadhaar
    await page.fill('input[name="pan"]', 'ABCDE1234F');
    await page.fill('input[name="aadhaar"]', '123456789012');
    
    // Click verify buttons
    const verifyPanButton = page.locator('button:has-text("Verify PAN")');
    const verifyAadhaarButton = page.locator('button:has-text("Verify Aadhaar")');
    await verifyPanButton.click();
    await verifyAadhaarButton.click();
    
    // Wait for verified badges
    await expect(page.locator('.badge-success').nth(0)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.badge-success').nth(1)).toBeVisible({ timeout: 5000 });
    
    await page.click('button:has-text("Continue")');

    // Step 2: Address Info
    await expect(page.locator('h2')).toContainText('Address');
    await page.fill('textarea[name="address"]', '456 Test Lane');
    await page.fill('input[name="pincode"]', '400001');
    
    // Wait for auto-fill city
    await expect(page.locator('input[name="city"]')).toHaveValue('Mumbai', { timeout: 3000 });
    await page.click('button:has-text("Continue")');

    // Step 3: Loan Details
    await expect(page.locator('h2')).toContainText('Loan Details');
    await page.locator('text=Personal Loan').click();
    await page.fill('input[name="loanAmount"]', '200000');
    await page.fill('input[name="salary"]', '50000');
    await page.click('button:has-text("Continue")');

    // Step 4: Employment Info
    await expect(page.locator('h2')).toContainText('Employment');
    await page.fill('input[name="occupation"]', 'Software Engineer');
    await page.fill('input[name="companyName"]', 'Acme Corp');
    await page.fill('input[name="yearsOfExperience"]', '3');
    await page.click('button:has-text("Continue")');

    // Step 5: Documents Check
    await expect(page.locator('h2')).toContainText('Documents');
    await page.click('button:has-text("I\'m Ready")');

    // Step 6: File Upload
    const fileChooserPromisePAN = page.waitForEvent('filechooser');
    await page.locator('.dropzone-area').nth(0).click();
    const fileChooserPAN = await fileChooserPromisePAN;
    await fileChooserPAN.setFiles({
      name: 'pan.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('dummy jpeg content')
    });

    const fileChooserPromiseAadhaar = page.waitForEvent('filechooser');
    await page.locator('.dropzone-area').nth(1).click();
    const fileChooserAadhaar = await fileChooserPromiseAadhaar;
    await fileChooserAadhaar.setFiles({
      name: 'aadhaar.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('dummy jpeg content')
    });

    const fileChooserPromiseExtra = page.waitForEvent('filechooser');
    await page.locator('.dropzone-area').nth(2).click();
    const fileChooserExtra = await fileChooserPromiseExtra;
    await fileChooserExtra.setFiles({
      name: 'salary.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('dummy jpeg content')
    });
    
    // Wait for uploads to complete and continue
    await expect(page.locator('text=All documents uploaded')).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("Continue")');

    // Step 7: Eligibility
    await expect(page.locator('h2')).toContainText('Eligibility');
    await expect(page.locator('text=Running eligibility check')).toBeVisible();
    await expect(page.locator('text=Pre-Approved!')).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("Continue to Review")');

    // Step 8: Review
    await expect(page.locator('h2')).toContainText('Review');
    await page.click('button:has-text("Proceed to E-Sign")');

    // Step 9: E-Sign
    await expect(page.locator('h2')).toContainText('E-Signature');
    const canvas = page.locator('.signature-container canvas');
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 10, box.y + 10);
      await page.mouse.down();
      await page.mouse.move(box.x + 100, box.y + 50);
      await page.mouse.up();
    }
    await page.click('button:has-text("Submit Application")');

    // Step 10: Success
    await expect(page.locator('.success-title')).toContainText('Application Submitted!');
  });
});

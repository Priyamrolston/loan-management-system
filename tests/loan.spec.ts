import { test, expect } from '@playwright/test';

test.describe('Loan Application E2E Workflow', () => {
  test('Complete Personal Loan Workflow', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:5173');

    // Step 1: Personal Info
    await expect(page.locator('h2')).toContainText('Personal Information');
    await page.fill('input[placeholder="John Doe"]', 'Jane Doe');
    await page.fill('input[type="email"]', 'jane.doe@example.com');
    await page.fill('input[placeholder="9876543210"]', '9876543210');
    
    // Fill PAN and Aadhaar
    await page.fill('input[placeholder="ABCDE1234F"]', 'ABCDE1234F');
    await page.fill('input[placeholder="123456789012"]', '123456789012');
    
    // Click verify buttons
    const verifyButtons = page.locator('button', { hasText: 'Verify' });
    await verifyButtons.nth(0).click();
    await verifyButtons.nth(1).click();
    
    // Wait for verified badge
    await expect(page.locator('.verify-badge').nth(0)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.verify-badge').nth(1)).toBeVisible({ timeout: 5000 });
    
    await page.click('button:has-text("Next Step")');

    // Step 2: Address Info
    await expect(page.locator('h2')).toContainText('Address Details');
    await page.fill('textarea[placeholder="123 Main St, Apt 4B"]', '456 Test Lane');
    await page.fill('input[placeholder="400001"]', '400001');
    // Wait for auto-fill
    await expect(page.locator('input[placeholder="City"]')).toHaveValue('Mumbai', { timeout: 2000 });
    await page.click('button:has-text("Next Step")');

    // Step 3: Loan Details
    await expect(page.locator('h2')).toContainText('Loan Details');
    await page.selectOption('select', 'personal');
    await page.fill('input[placeholder="500000"]', '200000');
    await page.fill('input[placeholder="50000"]', '50000');
    await page.click('button:has-text("Next Step")');

    // Step 4: Employment Info
    await expect(page.locator('h2')).toContainText('Employment Information');
    await page.fill('input[placeholder="e.g. Software Engineer"]', 'Software Engineer');
    await page.fill('input[placeholder="Acme Corp"]', 'Acme Corp');
    await page.fill('input[placeholder="5"]', '3');
    await page.click('button:has-text("Next Step")');

    // Step 5: Documents Check
    await expect(page.locator('h2')).toContainText('Document Requirements');
    await page.click('button:has-text("I\'m Ready to Upload")');

    // Step 6: File Upload
    // Since file upload dialogs are tricky, we'll just skip to Next if it allows or mock it.
    // For now, the user has to manually test upload, but in E2E we can set files.
    // Assuming our app requires uploads, we need to upload actual files. 
    // Wait, the current implementation checks if `uploads.pan` and `uploads.aadhaar` are present.
    // Let's create dummy files.
    const fileChooserPromisePAN = page.waitForEvent('filechooser');
    await page.locator('.dropzone').nth(0).click();
    const fileChooserPAN = await fileChooserPromisePAN;
    await fileChooserPAN.setFiles({
      name: 'pan.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });

    const fileChooserPromiseAadhaar = page.waitForEvent('filechooser');
    await page.locator('.dropzone').nth(0).click(); // Now the first dropzone is Aadhaar
    const fileChooserAadhaar = await fileChooserPromiseAadhaar;
    await fileChooserAadhaar.setFiles({
      name: 'aadhaar.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });
    
    await page.click('button:has-text("Next Step")');

    // Step 7: Eligibility
    await expect(page.locator('h2')).toContainText('Eligibility Analysis');
    await expect(page.locator('text=Running our AI eligibility engine...')).toBeVisible();
    await expect(page.locator('text=Pre-Approved!')).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("Continue to Review")');

    // Step 8: Review
    await expect(page.locator('h2')).toContainText('Application Summary');
    await page.click('button:has-text("Proceed to E-Sign")');

    // Step 9: E-Sign
    await expect(page.locator('h2')).toContainText('E-Signature');
    // Draw on canvas
    const canvas = page.locator('canvas.signature-pad');
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 10, box.y + 10);
      await page.mouse.down();
      await page.mouse.move(box.x + 100, box.y + 50);
      await page.mouse.up();
    }
    await page.click('button:has-text("Submit Application")');

    // Step 10: Success
    await expect(page.locator('h1')).toContainText('Application Submitted!');
  });
});

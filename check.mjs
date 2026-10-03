// Loads index.html in Chromium and fails unless the component bundle loads, the element upgrades and it renders its key prompt.
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
	const page = await browser.newPage();
	const errors = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto(pathToFileURL('index.html').href);
	const tag = await page.evaluate(() => document.querySelector('[publishable-key]').localName);
	await page.waitForFunction((name) => customElements.get(name), tag, { timeout: 30000 });
	await page.getByText('Replace the sample key').waitFor({ timeout: 30000 });
	if (errors.length) throw new Error(errors.join('\n'));
	console.log(`ok: <${tag}> loaded from the CDN and rendered`);
} finally {
	await browser.close();
}

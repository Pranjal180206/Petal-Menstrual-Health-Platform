const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/');

    // Wait a bit for React to render
    await new Promise(r => setTimeout(r, 2000));

    await browser.close();
})();

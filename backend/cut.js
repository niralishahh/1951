// scrape.js
// ▶︎ npm install puppeteer
const fs       = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  // 1) Launch headless Chromium
  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();

  // 2) Go to your page (EDIT THIS)
  const URL = 'https://app.cutanddry.com/orders-revised/view-one/467422087';
  await page.goto(URL, { waitUntil: 'networkidle2' });

  // 3) Wait until at least one product card is on the page
  await page.waitForSelector('.list-group-item._47hinf');

  // 4) Extract all items
  const data = await page.evaluate(() => {
    // grab all the cards
    const cards = Array.from(document.querySelectorAll('.list-group-item._47hinf'));
    return cards.map(card => {
      // name is in the first <div> inside .mb-2.text-wrap
      const nameEl   = card.querySelector('.mb-2.text-wrap > div:first-child');
      // detail (price & qty) is in the div under .d-flex.mt-2 .px-0.col-8
      const detailEl = card.querySelector('.d-flex.mt-2 .px-0.col-8 > div');

      const name   = nameEl   ? nameEl.textContent.trim()   : '';
      const detail = detailEl ? detailEl.textContent.trim() : '';

      // if you want to split "12.99 3" into price and qty:
      let price = '', qty = '';
      if (detail) {
        const parts = detail.split(/\s+/);
        price = parts[0] || '';
        qty   = parts[1] || '';
      }

      return { name, price, qty };
    });
  });

  // 5) Output to console + file
  console.log(data);
  fs.writeFileSync('output.json', JSON.stringify(data, null, 2));

  await browser.close();
})();

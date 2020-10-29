//const puppeteer = require('puppeteer');
// import { axios} from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer'
const isbns = ["https://www.amazon.in/gp/offer-listing/110849224X/condition=all", "https://www.amazon.in/gp/offer-listing/0345816021"];

console.time("asyncGet");
async function getBrowser() {
    const browser = await puppeteer.launch({
        executablePath: process.env.CHROME_BIN,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    return browser;
}

async function getPage(browser: puppeteer.Browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    return page;
}
async function getBook(browser: puppeteer.Browser, isbn: string) {
    const page = await getPage(browser);
    await page.goto(isbn);
    console.time("contentLoad" + isbn);
    await page.waitForSelector("div.olpOffer");
    const html = await page.evaluate(() => document.body.innerHTML);
    cheerio("div.olpOffer", html).each((index, ele) => {
        const price = cheerio(ele).find("div.olpPriceColumn span span").first().text().trim();
        const conditon = cheerio(ele).find("span.olpCondition").text().trim();
        const seller = cheerio(ele).find(".olpSellerName a").text().trim();
        console.log("" + index + ". " + "Price: " + price + " Condition: " + conditon + " Seller: " + seller);
    });
    console.timeEnd("contentLoad" + isbn);

    page.close();
}

async function runScrape() {
    const browser = await getBrowser();
    let prms = isbns.map(_isbn => getBook(browser, _isbn));
    Promise.all(prms).then(async () => {
        await browser.close();
        console.log("done");
        console.timeEnd("asyncGet");
    });
}

runScrape();
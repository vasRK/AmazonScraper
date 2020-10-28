//const puppeteer = require('puppeteer');
// import { axios} from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer'
const isbn = "https://www.amazon.in/gp/offer-listing/110849224X/condition=all";

async function getBook() {
    const browser = await puppeteer.launch({ headless: false });
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

    await page.goto(isbn);
    await page.waitForSelector("div.olpOffer");

    page.$
    const html = await page.evaluate(() => document.body.innerHTML);
    cheerio("div.olpOffer", html).each((index, ele) => {
        const price = cheerio(ele).find("div.olpPriceColumn span span").text().trim();
        const conditon = cheerio(ele).find("span.olpCondition").text().trim();
        const seller = cheerio(ele).find(".olpSellerName a").text().trim();
        console.log("" + index + ". " + "Price: " + price + " Condition: " + conditon + " Seller: " + seller);
    });

    await page.close();
    await browser.close();
}

getBook();

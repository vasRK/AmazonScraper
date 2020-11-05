
import puppeteer from 'puppeteer';
import fs from 'fs';
const isbns = ["https://pictures.abebooks.com/isbn/9780553386691-us-300.jpg"];

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
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    return page;
}

async function getBookImages(browser: puppeteer.Browser, url: string) {
    const page = await getPage(browser);
    const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('.jpg')),
        page.goto(url)
    ]);

    const buffer = await response.buffer();
    streamToFile(buffer);
    page.close();
}

async function runScrape() {
    const browser = await getBrowser();
    let prms = isbns.map(_isbn => getBookImages(browser, _isbn));
    Promise.all(prms).then(async () => {
        await browser.close();
        console.log("done");
        console.timeEnd("asyncGet");
    });
}


function streamToFile(streamData: Buffer) {
    var stream = fs.createWriteStream('bookcover', { flags: 'a' });
    stream.write(streamData, function () {
        // Now the data has been written.
    });
}

runScrape();
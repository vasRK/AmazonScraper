import puppeteer from 'puppeteer';
import { SCRAPE_API_KEY } from './app-config';
import { BlobClientUtil } from './blob-client-utils';

export class ImageScraper {
    browser: puppeteer.Browser;
    constructor() {
        this.getBrowser();
    }

    async getBrowser() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                executablePath: process.env.CHROME_BIN,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
        }

        return this.browser;
    }

    async getPage() {
        const page = await this.browser.newPage();
        await page.setViewport({ width: 1368, height: 720 });
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

    async getBookImages(isbn: string) {
        const buffer = await this.getBookImageBuffer(isbn);
        let status = false;
        if (buffer.byteLength > 0) {
            const uploadRes = await BlobClientUtil.UploadBlob(isbn, buffer);
            if (uploadRes._response.status == 201) {
                status = true;
            }
        }

        return { success: status };
    }

    async getBookImageBuffer(isbn: string) {
        const page = await this.getPage();
        const url = this.MakeURL(isbn);
        const [response] = await Promise.all([
            page.waitForResponse(response => response.url().includes('.jpg')),
            page.goto(url)
        ]);

        const buffer = await response.buffer();
        page.close();
        return buffer;
    }

    MakeURL(isbn: string) {
        //return `https://api.scraperapi.com/?key=${SCRAPE_API_KEY}&url=https://pictures.abebooks.com/isbn/${isbn}-us-300.jpg`;
        return `https://pictures.abebooks.com/isbn/${isbn}-us-300.jpg`;
    }
}

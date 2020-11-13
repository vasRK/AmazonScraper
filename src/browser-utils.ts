import puppeteer from 'puppeteer';
import { BlobClientUtil } from './blob-client-utils';

export class BrowserUtils {
    browser: puppeteer.Browser;
    constructor() {
        this.getBrowser();
    }
    getBrowser = async function () {
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

    getPage = async function () {
        const page = await this.browser.newPage();
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

    getBookImages = async function (url: string, bookId: number) {
        const page = await this.getPage();
        const [response] = await Promise.all([
            page.waitForResponse(response => response.url().includes('.jpg')),
            page.goto(`https://pictures.abebooks.com/isbn/${url}-us-300.jpg`)
        ]);

        const buffer = await response.buffer();
        const containerClient = await BlobClientUtil.GetClient();
        const blockBlobClient = containerClient.getBlockBlobClient(url);
        const uploadBlobResponse = await blockBlobClient.upload(buffer, buffer.length);
        //console.log(uploadBlobResponse);
        page.close();
        //console.log('fetch image end', url);
    }
}

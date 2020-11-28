import { BlobClientUtil } from './blob-client-utils';
import { _logger } from './logger'
import puppeteer from 'puppeteer';
import { handle } from './error-handler';

export class ImageScraper {
    browser: puppeteer.Browser;
    blobClient: BlobClientUtil;
    constructor() {
        this.getBrowser();
        this.blobClient = new BlobClientUtil();
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
        if (buffer && buffer.byteLength > 4000) { // assuming image size of min 4kb Min
            //await fs.writeFileSync(`./banana-prod/${isbn}.jpg`, buffer,{ flag: 'w+' });
           // status = true;
            const uploadRes = await this.blobClient.UploadBlob(isbn, buffer);
            if (uploadRes._response.status == 201) {
                status = true;
            }
        } else {
            if (buffer && buffer.length > 0) {
                _logger.trace("extract failed - ", buffer.toString('utf8'))
            }
        }

        return { success: status };
    }

    async getBookImageBuffer(isbn: string) {
        const page = await this.getPage();
        const url = this.MakeURL(isbn);
        const [response, res2] = await Promise.all([
            handle(page.waitForResponse(response => response.url().includes('.jpg'))),
            handle(page.goto(url))
        ]);

        if (response[1]) {
            throw Error("Error occured while fetching image...");
        }

        const buffer = await (<Array<puppeteer.Response>>response)[0].buffer();
        page.close();
        return buffer;
    }

    MakeURL(isbn: string) {
        // return `https://api.scraperapi.com/?key=${SCRAPE_API_KEY}&url=https://pictures.abebooks.com/isbn/${isbn}-us-300.jpg?render=true`;
        return `https://pictures.abebooks.com/isbn/${isbn}-us-300.jpg`;
    }
}

//9780801034336
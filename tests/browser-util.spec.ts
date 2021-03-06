import { Browser } from 'puppeteer';
import { ImageScraper } from '../src/browser-utils';
import { expect } from "chai";

describe('browser-util', () => {

    let browserUtil: ImageScraper;
    beforeEach(async () => {
        // runs before each test in this block
        browserUtil = new ImageScraper();
    });

    it('init creates browser', async () => {
        //const browserUtil = new BrowserUtil();
        const browsr = await browserUtil.getBrowser();
        expect(browsr).not.to.be.undefined;
    });

    it('get page returns page', async () => {
        await browserUtil.getBrowser();
        const page = await browserUtil.getPage();
        expect(page).not.to.be.undefined;
    });

    it('if load page with image buffer should be valid', async function () {
        this.timeout(0);
        await browserUtil.getBrowser();
        const buffer = await browserUtil.getBookImageBuffer("9780801034336");
        expect(buffer.byteLength).greaterThan(0);
    });

    it.only('if incorrect page buffer should be empty', async function () {
        this.timeout(0);
        await browserUtil.getBrowser();
        const buffer = await browserUtil.getBookImageBuffer("9780801034336");
        expect(buffer.byteLength).equals(0);
    });

});
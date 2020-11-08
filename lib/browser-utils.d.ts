import puppeteer from 'puppeteer';
export declare class BrowserUtils {
    browser: puppeteer.Browser;
    constructor();
    getBrowser: () => Promise<any>;
    getPage: () => Promise<any>;
    getBookImages: (url: string, bookId: number) => Promise<void>;
}

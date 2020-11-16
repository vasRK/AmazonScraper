/// <reference types="node" />
import puppeteer from 'puppeteer';
export declare class ImageScraper {
    browser: puppeteer.Browser;
    constructor();
    getBrowser(): Promise<puppeteer.Browser>;
    getPage(): Promise<puppeteer.Page>;
    getBookImages(isbn: string): Promise<{
        success: boolean;
    }>;
    getBookImageBuffer(isbn: string): Promise<Buffer>;
    MakeURL(isbn: string): string;
}

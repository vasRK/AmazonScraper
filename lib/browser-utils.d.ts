/// <reference types="node" />
import { BlobClientUtil } from './blob-client-utils';
import puppeteer from 'puppeteer';
export declare class ImageScraper {
    browser: puppeteer.Browser;
    blobClient: BlobClientUtil;
    constructor();
    getBrowser(): Promise<puppeteer.Browser>;
    getPage(): Promise<puppeteer.Page>;
    getBookImages(isbn: string): Promise<{
        success: boolean;
    }>;
    getBookImageBuffer(isbn: string): Promise<Buffer>;
    MakeURL(isbn: string): string;
}

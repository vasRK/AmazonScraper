/// <reference types="node" />
import { ContainerClient } from '@azure/storage-blob';
export declare class BlobClientUtil {
    container: ContainerClient;
    constructor();
    GetClient(): ContainerClient;
    UploadBlob(fileName: string, buffer: Buffer): Promise<import("@azure/storage-blob").BlockBlobUploadResponse>;
}

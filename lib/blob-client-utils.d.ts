/// <reference types="node" />
import { ContainerClient } from '@azure/storage-blob';
export declare class BlobClientUtil {
    GetClient(): ContainerClient;
    UploadBlob(fileName: string, buffer: Buffer): Promise<import("@azure/storage-blob").BlockBlobUploadResponse>;
}

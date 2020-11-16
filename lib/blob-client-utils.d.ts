/// <reference types="node" />
export declare class BlobClientUtil {
    static GetClient(): Promise<import("@azure/storage-blob").ContainerClient>;
    static UploadBlob(fileName: string, buffer: Buffer): Promise<import("@azure/storage-blob").BlockBlobUploadResponse>;
}

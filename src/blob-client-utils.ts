
require("dotenv").config();

import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

import { DefaultAzureCredential } from '@azure/identity';
import { _logger } from './logger';

export class BlobClientUtil {
    container: ContainerClient;
    constructor() {
        this.container = this.GetClient();
    }

    GetClient() {

        if (this.container) {
            return this.container;
        }

        // Enter your storage account name
        const account = process.env.AZURE_ACCOUNT_NAME || "";

        // Azure AD Credential information is required to run this sample:
        if (
            !process.env.AZURE_TENANT_ID ||
            !process.env.AZURE_CLIENT_ID ||
            !process.env.AZURE_CLIENT_SECRET
        ) {
            console.warn(
                "Azure AD authentication information not provided, but it is required to run this sample. Exiting."
            );
            return;
        }

        // ONLY AVAILABLE IN NODE.JS RUNTIME
        // DefaultAzureCredential will first look for Azure Active Directory (AAD)
        // client secret credentials in the following environment variables:
        //
        // - AZURE_TENANT_ID: The ID of your AAD tenant
        // - AZURE_CLIENT_ID: The ID of your AAD app registration (client)
        // - AZURE_CLIENT_SECRET: The client secret for your AAD app registration
        //
        // If those environment variables aren't found and your application is deployed
        // to an Azure VM or App Service instance, the managed service identity endpoint
        // will be used as a fallback authentication source.

        const defaultAzureCredential = new DefaultAzureCredential();
        const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, defaultAzureCredential);

        try {
            this.container = blobServiceClient.getContainerClient("banana-prod");
            _logger.info('container client created');
            console.log('container client created');
        }
        catch (err) {
            _logger.trace('blob client err - ', err)
        }

        return this.container;
    }

    async UploadBlob(fileName: string, buffer: Buffer) {
        const containerClient = this.GetClient();
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        return await blockBlobClient.upload(buffer, buffer.length);
    }
}
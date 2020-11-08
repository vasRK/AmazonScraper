
require("dotenv").config();
import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';

export class BlogClientUtil {
    static async GetClient() {
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
        const containerClient = await blobServiceClient.getContainerClient("banana");
        return containerClient;
    }
}
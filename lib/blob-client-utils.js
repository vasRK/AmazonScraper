"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobClientUtil = void 0;
require("dotenv").config();
var storage_blob_1 = require("@azure/storage-blob");
var identity_1 = require("@azure/identity");
var logger_1 = require("./logger");
var BlobClientUtil = /** @class */ (function () {
    function BlobClientUtil() {
    }
    BlobClientUtil.prototype.GetClient = function () {
        // Enter your storage account name
        var account = process.env.AZURE_ACCOUNT_NAME || "";
        // Azure AD Credential information is required to run this sample:
        if (!process.env.AZURE_TENANT_ID ||
            !process.env.AZURE_CLIENT_ID ||
            !process.env.AZURE_CLIENT_SECRET) {
            console.warn("Azure AD authentication information not provided, but it is required to run this sample. Exiting.");
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
        var defaultAzureCredential = new identity_1.DefaultAzureCredential();
        var blobServiceClient = new storage_blob_1.BlobServiceClient("https://" + account + ".blob.core.windows.net", defaultAzureCredential);
        var containerClient;
        try {
            containerClient = blobServiceClient.getContainerClient("banana-prod");
        }
        catch (err) {
            logger_1._logger.trace('blob client err - ', err);
        }
        return containerClient;
    };
    BlobClientUtil.prototype.UploadBlob = function (fileName, buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var containerClient, blockBlobClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        containerClient = this.GetClient();
                        blockBlobClient = containerClient.getBlockBlobClient(fileName);
                        return [4 /*yield*/, blockBlobClient.upload(buffer, buffer.length)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return BlobClientUtil;
}());
exports.BlobClientUtil = BlobClientUtil;
//# sourceMappingURL=blob-client-utils.js.map
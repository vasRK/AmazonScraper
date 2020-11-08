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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserUtils = void 0;
var puppeteer_1 = __importDefault(require("puppeteer"));
var blob_client_utils_1 = require("./blob-client-utils");
var BrowserUtils = /** @class */ (function () {
    function BrowserUtils() {
        this.getBrowser = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!!this.browser) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, puppeteer_1.default.launch({
                                    executablePath: process.env.CHROME_BIN,
                                    args: [
                                        '--no-sandbox',
                                        '--disable-setuid-sandbox'
                                    ]
                                })];
                        case 1:
                            _a.browser = _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/, this.browser];
                    }
                });
            });
        };
        this.getPage = function () {
            return __awaiter(this, void 0, void 0, function () {
                var page;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.browser.newPage()];
                        case 1:
                            page = _a.sent();
                            return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, page.setRequestInterception(true)];
                        case 3:
                            _a.sent();
                            page.on('request', function (req) {
                                if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font') {
                                    req.abort();
                                }
                                else {
                                    req.continue();
                                }
                            });
                            return [2 /*return*/, page];
                    }
                });
            });
        };
        this.getBookImages = function (url, bookId) {
            return __awaiter(this, void 0, void 0, function () {
                var page, response, buffer, containerClient, blockBlobClient, uploadBlobResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getPage()];
                        case 1:
                            page = _a.sent();
                            return [4 /*yield*/, Promise.all([
                                    page.waitForResponse(function (response) { return response.url().includes('.jpg'); }),
                                    page.goto("https://pictures.abebooks.com/isbn/" + url + "-us-300.jpg")
                                ])];
                        case 2:
                            response = (_a.sent())[0];
                            return [4 /*yield*/, response.buffer()];
                        case 3:
                            buffer = _a.sent();
                            return [4 /*yield*/, blob_client_utils_1.BlogClientUtil.GetClient()];
                        case 4:
                            containerClient = _a.sent();
                            blockBlobClient = containerClient.getBlockBlobClient(url + "-" + bookId);
                            return [4 /*yield*/, blockBlobClient.upload(buffer, buffer.length)];
                        case 5:
                            uploadBlobResponse = _a.sent();
                            console.log(uploadBlobResponse);
                            page.close();
                            console.log('fetch image end', url);
                            return [2 /*return*/];
                    }
                });
            });
        };
        this.getBrowser();
    }
    return BrowserUtils;
}());
exports.BrowserUtils = BrowserUtils;
//# sourceMappingURL=browser-utils.js.map
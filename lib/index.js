"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var service_bus_1 = require("@azure/service-bus");
var app_config_1 = require("./app-config");
var browser_utils_1 = require("./browser-utils");
var repository_1 = require("./repository");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sbClient, queueClient, receiver, scraper, repository, msgHandler, conn, messages, extractResponses, completeBookIds, query, failedBookIds, msgCompleteReq, res, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sbClient = service_bus_1.ServiceBusClient.createFromConnectionString(app_config_1.AZURE_SERVICEBUS_CONNECTION_STRING);
                    queueClient = sbClient.createQueueClient(app_config_1.AZURE_SERVICEBUS_QUEUE);
                    receiver = queueClient.createReceiver(service_bus_1.ReceiveMode.peekLock);
                    scraper = new browser_utils_1.ImageScraper();
                    repository = new repository_1.Repository();
                    msgHandler = function (message) { return __awaiter(_this, void 0, void 0, function () {
                        var book, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    book = __assign({}, message.userProperties);
                                    return [4 /*yield*/, scraper.getBookImages(book.isbn13)];
                                case 1:
                                    response = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, response), { bookId: book.bookId })];
                            }
                        });
                    }); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, 11, 13]);
                    return [4 /*yield*/, repository.GetConnection()];
                case 2:
                    conn = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 9];
                    console.log('batch start');
                    return [4 /*yield*/, receiver.receiveMessages(30)];
                case 4:
                    messages = _a.sent();
                    return [4 /*yield*/, Promise.all(messages.map(msgHandler))];
                case 5:
                    extractResponses = _a.sent();
                    completeBookIds = extractResponses.filter(function (res) { return res.success; }).map(function (res) { return res.bookId; });
                    if (!(completeBookIds.length > 0)) return [3 /*break*/, 7];
                    query = "UPDATE [dbo].[BookInformation] SET IsImageDownloaded = 'True' WHERE Id IN(" + completeBookIds.join(",") + ")";
                    return [4 /*yield*/, conn.request().query(query)];
                case 6:
                    _a.sent();
                    console.log("image extraction completed for book ids " + completeBookIds.join());
                    _a.label = 7;
                case 7:
                    failedBookIds = extractResponses.filter(function (res) { return !res.success; }).map(function (res) { return res.bookId; });
                    if (failedBookIds.length > 0) {
                        console.log("image extraction failed for book ids " + failedBookIds.join());
                    }
                    msgCompleteReq = messages.map(function (msg) { return msg.complete(); });
                    return [4 /*yield*/, Promise.all(__spreadArrays(msgCompleteReq))];
                case 8:
                    res = _a.sent();
                    console.log('batch end');
                    return [3 /*break*/, 3];
                case 9: return [3 /*break*/, 13];
                case 10:
                    err_1 = _a.sent();
                    console.log('error on while read', err_1);
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, sbClient.close()];
                case 12:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.log("Error occurred: ", err);
});
//# sourceMappingURL=index.js.map
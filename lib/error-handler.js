"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
function handle(promise) {
    return promise
        .then(function (data) { return ([data, undefined]); })
        .catch(function (error) { return ([undefined, error]); });
}
exports.handle = handle;
//# sourceMappingURL=error-handler.js.map
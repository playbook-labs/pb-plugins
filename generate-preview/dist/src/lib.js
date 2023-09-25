"use strict";
// Helper functions to work with the Playbook API
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaybookAPI = exports.uploadBufferToUrl = exports.downloadFileToBuffer = void 0;
const axios_1 = __importDefault(require("axios"));
function downloadFileToBuffer(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, axios_1.default)({
            url: url,
            responseType: "arraybuffer",
        });
        return response.data;
    });
}
exports.downloadFileToBuffer = downloadFileToBuffer;
function uploadBufferToUrl(buffer, uploadUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, axios_1.default)({
            method: "put",
            headers: { "Content-Type": "image/png" },
            url: uploadUrl,
            data: buffer,
        });
    });
}
exports.uploadBufferToUrl = uploadBufferToUrl;
class PlaybookAPI {
    constructor({ pluginInvocationToken, callbackUrl, }) {
        this.callbackUrl = callbackUrl;
        this.pluginInvocationToken = pluginInvocationToken;
    }
    // Create placeholder assets (assets with no data, only titles).
    // After the assets are created, fill in their file data by
    // uploading to the `uploadUrl` in the response.
    createPlaceholderAssets(assets) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, axios_1.default)({
                method: "post",
                url: this.callbackUrl,
                data: {
                    pluginInvocationToken: this.pluginInvocationToken,
                    operation: "createAssets",
                    assets,
                },
            });
            return response.data.assets;
        });
    }
    // Open a new tab in the user's browser, as long as their
    // window is still open
    openUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, axios_1.default)({
                method: "post",
                url: this.callbackUrl,
                data: {
                    pluginInvocationToken: this.pluginInvocationToken,
                    openUrl: url,
                },
            });
        });
    }
    generateAssetPreviewUrl(assetToken, width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, axios_1.default)({
                method: "post",
                url: this.callbackUrl,
                data: {
                    pluginInvocationToken: this.pluginInvocationToken,
                    assetTokenToGeneratePreviewFor: assetToken,
                    previewWidth: width,
                    previewHeight: height
                },
            });
        });
    }
    // Always call this at the end of your plugin's run to mark
    // the invocation as complete
    reportStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, axios_1.default)({
                method: "post",
                url: this.callbackUrl,
                data: {
                    pluginInvocationToken: this.pluginInvocationToken,
                    status,
                },
            });
        });
    }
}
exports.PlaybookAPI = PlaybookAPI;

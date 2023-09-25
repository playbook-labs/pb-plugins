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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const axios_1 = __importDefault(require("axios"));
function default_1({ pluginInvocationToken, callbackUrl, assets, }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Invoked plugin", callbackUrl);
        const playbookAPI = new lib_1.PlaybookAPI({
            pluginInvocationToken,
            callbackUrl,
        });
        const inputAsset = assets[0];
        const inputBuffer = (yield (0, axios_1.default)({ url: "https://img.playbook.com/BZ5cWTaMqd9tP1aTWKWr2Z8I1SI-lx6hI7U0p2EpBr0/Z3M6Ly9wbGF5Ym9v/ay1hc3NldHMtcHVi/bGljLzE4MWI4YzZi/LTU1ZDctNDExZi1i/YTcyLTE4MTk5Mzkw/NGRlOA", responseType: "arraybuffer" })).data;
        const response = yield playbookAPI.generateAssetPreviewUrl(inputAsset.token, 1201, 1201);
        yield (0, lib_1.uploadBufferToUrl)(inputBuffer, response.data.previewUploadUrl);
        yield playbookAPI.reportStatus("success");
        console.log("Done");
    });
}
exports.default = default_1;

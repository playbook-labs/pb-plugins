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
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
function default_1({ pluginInvocationToken, assets, callbackUrl, }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("split2x2", pluginInvocationToken, JSON.stringify(assets), callbackUrl);
        const inputAsset = assets[0];
        // TODO: consider using https://github.com/sindresorhus/got, it has a simpler syntax:
        // const imageBuffer = await got(url).buffer();
        const inputImageBuffer = (yield (0, axios_1.default)({
            url: inputAsset.url,
            responseType: "arraybuffer",
        })).data;
        console.log("loaded input asset");
        const outputFileName = "/tmp/" + (0, uuid_1.v4)();
        yield (0, sharp_1.default)(inputImageBuffer)
            .rotate(180)
            .toFile(outputFileName); // .toBuffer has a memory leak on Google Cloud Functions
        console.log("processed with sharp");
        // Create a placeholder asset to upload the result to
        const createdAssets = (yield (0, axios_1.default)({
            method: "post",
            url: callbackUrl,
            data: {
                pluginInvocationToken,
                operation: "createAssets",
                assets: [
                    {
                        title: `${inputAsset.title} - flipped`,
                        group: inputAsset.token,
                    },
                ],
            },
        })).data.assets;
        console.log("created assets", JSON.stringify(createdAssets));
        const outputImageBuffer = fs_1.default.readFileSync(outputFileName);
        yield (0, axios_1.default)({
            method: "put",
            headers: { "Content-Type": "image/png" },
            url: createdAssets[0].uploadUrl,
            data: outputImageBuffer,
        });
        console.log("uploaded output asset");
        yield (0, axios_1.default)({
            method: "post",
            url: callbackUrl,
            data: {
                pluginInvocationToken,
                status: "success",
            },
        });
        console.log("done");
    });
}
exports.default = default_1;

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
const sharp_1 = __importDefault(require("sharp"));
const outputs = [
    {
        name: "top left",
        leftOffset: 0,
        topOffset: 0,
    },
    {
        name: "top right",
        leftOffset: 0.5,
        topOffset: 0,
    },
    {
        name: "bottom left",
        leftOffset: 0,
        topOffset: 0.5,
    },
    {
        name: "bottom right",
        leftOffset: 0.5,
        topOffset: 0.5,
    },
];
function default_1({ pluginInvocationToken, callbackUrl, assets, }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("invoked plugin");
        const playbookAPI = new lib_1.PlaybookAPI({
            pluginInvocationToken,
            callbackUrl,
        });
        const inputAsset = assets[0];
        const inputImageBuffer = yield (0, lib_1.downloadFileToBuffer)(inputAsset.url);
        console.log("loaded input asset");
        const { width, height } = yield (0, sharp_1.default)(inputImageBuffer).metadata();
        console.log("size", width, height);
        if (!width || !height || width < 2 || height < 2) {
            console.log("failure", width, height);
            playbookAPI.reportStatus("failure");
            return;
        }
        const skeletonAssets = yield playbookAPI.createSkeletonAssets(outputs.map((output) => ({
            title: `${inputAsset.title} - ${output.name}`,
            group: inputAsset.token,
        })));
        console.log("created skeleton assets");
        for (let i = 0; i < outputs.length; i++) {
            const outputImageBuffer = yield (0, sharp_1.default)(inputImageBuffer)
                .extract({
                left: outputs[i].leftOffset * width,
                top: outputs[i].topOffset * height,
                width: width / 2,
                height: height / 2,
            })
                .toBuffer();
            console.log(`processed image ${i + 1} with sharp`);
            yield (0, lib_1.uploadBufferToUrl)(outputImageBuffer, skeletonAssets[i].uploadUrl);
            console.log(`uploaded image ${i + 1}`);
        }
        playbookAPI.reportStatus("success");
        console.log("done");
    });
}
exports.default = default_1;

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
const express_1 = __importDefault(require("express"));
const plugin_js_1 = __importDefault(require("./src/plugin.js"));
// TODO: investigate if we can enable `debugger`
// TODO: would be SICK if there was a "rerun last request" button. Not hard to implement
const port = 3333;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received GET');
    console.log(req.body);
    res.send('Hello World! Use POST to trigger the plugin in development.');
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received POST');
    const { pluginInvocationToken, assets, callbackUrl } = req.body;
    res.sendStatus(200);
    yield (0, plugin_js_1.default)({ pluginInvocationToken, assets, callbackUrl });
}));
app.listen(port, () => {
    console.log(`\nPlugin listening on port ${port}.\nUse \`ngrok http ${port}\` to expose this port to the internet for development.`);
});

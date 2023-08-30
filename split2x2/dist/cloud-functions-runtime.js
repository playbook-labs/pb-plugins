"use strict";
// Deployment using Google Cloud Functions.
// We need two functions:
//   - Function A to handle the HTTP request, kick off Function B, and return immediately
//   - Function B to do the actual work asynchronously
//
// Google Cloud Deployment instructions at the bottom of this file
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("@google-cloud/functions-framework"));
const pubsub_1 = require("@google-cloud/pubsub");
const plugin_1 = __importDefault(require("./src/plugin"));
// This is the function that will be called by Playbook when the plugin is invoked.
// All it does is enqueue a separate job to process the assets and returns 200 OK
functions.http('split2x2InvocationHandler', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // We use pubsub to enqueue a job to process the assets
    const dataBuffer = Buffer.from(JSON.stringify(req.body));
    yield new pubsub_1.PubSub()
        .topic('SPLIT_2x2_TOPIC')
        .publishMessage({ data: dataBuffer });
    // Return quickly so we don't run into an HTTP timeout
    res.status(200).send('OK');
}));
// This function does the actual work of the plugin asynchronously
functions.cloudEvent('split2x2ProcessAsync', (cloudEvent) => __awaiter(void 0, void 0, void 0, function* () {
    const body = JSON.parse(Buffer.from(cloudEvent.data.message.data, 'base64').toString());
    console.log('data', cloudEvent.data.message.data);
    console.log('body', body);
    const { pluginInvocationToken, assets, callbackUrl } = body;
    (0, plugin_1.default)({ pluginInvocationToken, assets, callbackUrl });
}));
// Set up a google cloud account and set up billing
// Currently offering $300 free -> https://cloud.google.com/free/docs/gcp-free-tier
// Install Google Cloud SDK
// https://cloud.google.com/sdk/docs/install or `brew install google-cloud-sdk`
// Login
// gcloud auth login
// Create and Set Project
// gcloud projects create EXAMPLE_PLUGIN_PROJECT
// gcloud config set project EXAMPLE_PLUGIN_PROJECT
// Create PubSub Topic
// gcloud pubsub topics create SPLIT_2x2_TOPIC
// Deploy Invocation Handler
// gcloud functions deploy split-2x2-invocation-handler \
//   --gen2 \
//   --runtime=nodejs20 \
//   --region=us-west1 \
//   --source=. \
//   --entry-point=split2x2InvocationHandler \
//   --trigger-http \
//   --allow-unauthenticated \
//   --timeout=540
// Deploy Async Processing Function
// gcloud functions deploy split-2x2-process-async \
//   --trigger-topic=SPLIT_2x2_TOPIC \
//   --gen2 \
//   --runtime=nodejs20 \
//   --region=us-west1 \
//   --source=. \
//   --entry-point=split2x2ProcessAsync \
//   --timeout=540

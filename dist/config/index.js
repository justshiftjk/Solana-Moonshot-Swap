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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.originUrl = exports.originSellUrl = exports.originBuyUrl = exports.port = exports.solanaConnection = exports.privateKey = exports.wssUrl = exports.rpcUrl = void 0;
const web3_js_1 = require("@solana/web3.js");
const dotenv_1 = __importDefault(require("dotenv"));
const bs58_1 = __importDefault(require("bs58"));
const axios_1 = __importDefault(require("axios"));
const solana_1 = require("../utils/solana");
dotenv_1.default.config();
exports.rpcUrl = process.env.RPC_URL;
exports.wssUrl = process.env.WSS_URL;
exports.privateKey = process.env.PRIVATE_KEY;
exports.solanaConnection = new web3_js_1.Connection(exports.rpcUrl, { wsEndpoint: exports.wssUrl });
exports.port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 9000;
exports.originBuyUrl = process.env.ORIGIN_BUY_URL;
exports.originSellUrl = process.env.ORIGIN_SELL_URL;
exports.originUrl = process.env.ORIGIN_URL;
const creator = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(exports.privateKey));
let status = '';
const task = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(new Date());
    try {
        const data = (yield axios_1.default.get(exports.originUrl)).data[0];
        if (data == '' || JSON.stringify(data) == status)
            return;
        status = JSON.stringify(data);
        console.log(status);
        const { type, token, sol_amount } = data;
        console.log(type, token, sol_amount);
        const creator = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(exports.privateKey));
        if (type == 'buy') {
            console.log('buy');
            const result = yield (0, solana_1.moonshotBuy)(token, creator, BigInt(sol_amount * web3_js_1.LAMPORTS_PER_SOL), 100);
        }
        else if (type == 'sell') {
            console.log('sell');
            const result = yield (0, solana_1.moonshotSell)(token, creator, BigInt(0), 100);
        }
    }
    catch (e) {
        console.error(e);
    }
});
// cron.schedule('*/1 * * * * *', task);
// console.log('cron is running')

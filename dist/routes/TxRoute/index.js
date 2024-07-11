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
const web3_js_1 = require("@solana/web3.js");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bs58_1 = __importDefault(require("bs58"));
const config_1 = require("../../config");
const solana_1 = require("../../utils/solana");
const spl_token_1 = require("@solana/spl-token");
const TxRouter = (0, express_1.Router)();
// @route    POST api/moonshot/swap
// @desc     Swap on moonshot
// @access   Public
TxRouter.post("/swap", (0, express_validator_1.check)("mintAddress", "Please include token mint address").exists(), (0, express_validator_1.check)("amount", "Please include token amount").exists(), (0, express_validator_1.check)("tradeDirection", "Please include token swap direction").exists(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const { mintAddress, amount, tradeDirection, slippageBps } = req.body;
        console.log('api/moonshot/swap:', tradeDirection, mintAddress, amount);
        const creator = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(config_1.privateKey));
        if (tradeDirection == 'BUY') {
            const result = yield (0, solana_1.moonshotBuy)(mintAddress, creator, BigInt(Number(amount) * web3_js_1.LAMPORTS_PER_SOL), slippageBps !== null && slippageBps !== void 0 ? slippageBps : 100);
            if (result.error) {
                console.error(result.error);
                return res.status(400).json(result);
            }
            else {
                return res.json(result);
            }
        }
        else if (tradeDirection == 'SELL') {
            if (amount != 0) {
                const result = yield (0, solana_1.moonshotSell)(mintAddress, creator, BigInt(amount), slippageBps !== null && slippageBps !== void 0 ? slippageBps : 100);
                if (result.error) {
                    console.error(result.error);
                    return res.status(400).json(result);
                }
                else {
                    return res.json(result);
                }
            }
            else {
                const ata = (0, spl_token_1.getAssociatedTokenAddressSync)(new web3_js_1.PublicKey(mintAddress), creator.publicKey);
                const balance = yield config_1.solanaConnection.getTokenAccountBalance(ata);
                const result = yield (0, solana_1.moonshotSell)(mintAddress, creator, BigInt(balance.value.amount), slippageBps !== null && slippageBps !== void 0 ? slippageBps : 100);
                if (result.error) {
                    console.error(result.error);
                    return res.status(400).json(result);
                }
                else {
                    return res.json(result);
                }
            }
        }
    }
    catch (e) {
        console.error(e);
        return res.status(500).send({ error: e });
    }
}));
exports.default = TxRouter;

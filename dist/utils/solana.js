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
Object.defineProperty(exports, "__esModule", { value: true });
exports.moonshotSell = exports.moonshotBuy = void 0;
const moonshot_sdk_1 = require("@wen-moon-ser/moonshot-sdk");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
const moonshotBuy = (mintAddress, creator, collateralAmount, slippageBps) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tradeDirection = "BUY";
        const moonshot = new moonshot_sdk_1.Moonshot({
            rpcUrl: config_1.rpcUrl,
            authToken: '',
            environment: moonshot_sdk_1.Environment.MAINNET,
        });
        const token = moonshot.Token({
            mintAddress
        });
        const curvePos = yield token.getCurvePosition();
        console.log('curvePos', curvePos);
        const creatorPK = creator.publicKey.toBase58();
        console.log('creatorPK', creatorPK);
        const tokenAmount = yield token.getTokenAmountByCollateral({
            collateralAmount,
            tradeDirection
        });
        console.log('tokenAmount', tokenAmount);
        console.log('collateralAmount', collateralAmount);
        const { ixs } = yield token.prepareIxs({
            slippageBps,
            creatorPK,
            tokenAmount,
            collateralAmount,
            tradeDirection
        });
        const customPriceIx = web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 100000,
        });
        const customLimitIx = web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
            units: 100000,
        });
        const blockhash = yield config_1.solanaConnection.getLatestBlockhash('confirmed');
        const messageV0 = new web3_js_1.TransactionMessage({
            payerKey: creator.publicKey,
            recentBlockhash: blockhash.blockhash,
            instructions: [customPriceIx, customLimitIx, ...ixs],
        }).compileToV0Message();
        const transaction = new web3_js_1.VersionedTransaction(messageV0);
        transaction.sign([creator]);
        const txHash = yield config_1.solanaConnection.sendTransaction(transaction, {
            skipPreflight: false,
            maxRetries: 0,
            preflightCommitment: 'confirmed',
        });
        console.log('signature', txHash);
        return { success: txHash };
    }
    catch (e) {
        console.error(e);
        return { error: e };
    }
});
exports.moonshotBuy = moonshotBuy;
const moonshotSell = (mintAddress, creator, tokenAmount, slippageBps) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tradeDirection = "SELL";
        const moonshot = new moonshot_sdk_1.Moonshot({
            rpcUrl: config_1.rpcUrl,
            authToken: '',
            environment: moonshot_sdk_1.Environment.MAINNET,
        });
        const token = moonshot.Token({
            mintAddress
        });
        const curvePos = yield token.getCurvePosition();
        console.log('curvePos', curvePos);
        const creatorPK = creator.publicKey.toBase58();
        console.log('creatorPK', creatorPK);
        const collateralAmount = yield token.getCollateralAmountByTokens({
            tokenAmount,
            tradeDirection
        });
        console.log('tokenAmount', tokenAmount);
        console.log('collateralAmount', collateralAmount);
        const { ixs } = yield token.prepareIxs({
            slippageBps,
            creatorPK,
            tokenAmount,
            collateralAmount,
            tradeDirection
        });
        const customPriceIx = web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 100000,
        });
        const customLimitIx = web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
            units: 100000,
        });
        const blockhash = yield config_1.solanaConnection.getLatestBlockhash('confirmed');
        const messageV0 = new web3_js_1.TransactionMessage({
            payerKey: creator.publicKey,
            recentBlockhash: blockhash.blockhash,
            instructions: [customPriceIx, customLimitIx, ...ixs],
        }).compileToV0Message();
        const transaction = new web3_js_1.VersionedTransaction(messageV0);
        transaction.sign([creator]);
        const txHash = yield config_1.solanaConnection.sendTransaction(transaction, {
            skipPreflight: false,
            maxRetries: 0,
            preflightCommitment: 'confirmed',
        });
        console.log('signature', txHash);
        return { success: txHash };
    }
    catch (e) {
        console.error(e);
        return { error: e };
    }
});
exports.moonshotSell = moonshotSell;

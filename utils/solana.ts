

import {
  Moonshot,
  Environment,
} from '@wen-moon-ser/moonshot-sdk';
import { ComputeBudgetProgram, Keypair, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

import { rpcUrl, solanaConnection } from '../config';

export const moonshotBuy = async (mintAddress: string, creator: Keypair, collateralAmount: bigint, slippageBps: number) => {
  try {
    const tradeDirection = "BUY"
    const moonshot = new Moonshot({
      rpcUrl,
      authToken: '',
      environment: Environment.MAINNET,
    });

    const token = moonshot.Token({
      mintAddress
    });

    const curvePos = await token.getCurvePosition();
    console.log('curvePos', curvePos);

    const creatorPK = creator.publicKey.toBase58()
    console.log('creatorPK', creatorPK);

    const tokenAmount = await token.getTokenAmountByCollateral({
      collateralAmount,
      tradeDirection
    });

    console.log('tokenAmount', tokenAmount);
    console.log('collateralAmount', collateralAmount);

    const { ixs } = await token.prepareIxs({
      slippageBps,
      creatorPK,
      tokenAmount,
      collateralAmount,
      tradeDirection
    });

    const customPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000,
    });

    const customLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: 100_000,
    });

    const blockhash = await solanaConnection.getLatestBlockhash('confirmed');

    const messageV0 = new TransactionMessage({
      payerKey: creator.publicKey,
      recentBlockhash: blockhash.blockhash,
      instructions: [customPriceIx, customLimitIx, ...ixs],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    transaction.sign([creator]);

    const txHash = await solanaConnection.sendTransaction(transaction, {
      skipPreflight: false,
      maxRetries: 0,
      preflightCommitment: 'confirmed',
    });

    console.log('signature',txHash)

    return { success: txHash }

  } catch (e) {
    console.error(e)
    return { error: e }
  }
};

export const moonshotSell = async (mintAddress: string, creator: Keypair, tokenAmount: bigint, slippageBps: number) => {
  try {
    const tradeDirection = "SELL"

    const moonshot = new Moonshot({
      rpcUrl,
      authToken: '',
      environment: Environment.MAINNET,
    });

    const token = moonshot.Token({
      mintAddress
    });

    const curvePos = await token.getCurvePosition();
    console.log('curvePos', curvePos);

    const creatorPK = creator.publicKey.toBase58()
    console.log('creatorPK', creatorPK);

    const collateralAmount = await token.getCollateralAmountByTokens({
      tokenAmount,
      tradeDirection
    });

    console.log('tokenAmount', tokenAmount);
    console.log('collateralAmount', collateralAmount);

    const { ixs } = await token.prepareIxs({
      slippageBps,
      creatorPK,
      tokenAmount,
      collateralAmount,
      tradeDirection
    });

    const customPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100_000,
    });

    const customLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: 100_000,
    });

    const blockhash = await solanaConnection.getLatestBlockhash('confirmed');

    const messageV0 = new TransactionMessage({
      payerKey: creator.publicKey,
      recentBlockhash: blockhash.blockhash,
      instructions: [customPriceIx, customLimitIx, ...ixs],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    transaction.sign([creator]);

    const txHash = await solanaConnection.sendTransaction(transaction, {
      skipPreflight: false,
      maxRetries: 0,
      preflightCommitment: 'confirmed',
    });

    console.log('signature',txHash)

    return { success: txHash }

  } catch (e) {
    console.error(e)
    return { error: e }
  }
};
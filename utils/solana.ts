

import {
  Moonshot,
  Environment,
  SolanaSerializationService,
} from '@wen-moon-ser/moonshot-sdk';
import { Keypair, VersionedTransaction } from '@solana/web3.js';

import { rpcUrl, solanaConnection } from '../config';

export const moonshotSwap = async (mintAddress: string, creator: Keypair, tokenAmount: bigint, tradeDirection: "BUY" | "SELL", slippageBps: number) => {
  try {
    const moonshot = new Moonshot({
      rpcUrl,
      authToken: '',
      environment: Environment.MAINNET,
    });
    console.log(1)
    
    const token = moonshot.Token({
      mintAddress
    });
    console.log(2)

    const curvePos = await token.getCurvePosition();
    console.log('curvePos', curvePos);

    const creatorPK = creator.publicKey.toBase58()
    console.log('creatorPK', creatorPK);

    // token to sol
    const collateralAmount = await token.getCollateralAmountByTokens({
      tokenAmount,
      tradeDirection
    });

    // sol to token
    // const collateralAmount = await token.getTokenAmountByCollateral({
    //   collateralAmount: tokenAmount,
    //   tradeDirection
    // });

    console.log('collateralAmount', collateralAmount);
    return { success: 'success' }
    // const { transaction } = await token.prepareTx({
    //   slippageBps,
    //   creatorPK,
    //   tokenAmount,
    //   collateralAmount,
    //   tradeDirection 
    // });

    // const versionedTransaction =
    //   SolanaSerializationService.deserializeVersionedTransaction(transaction);

    // if (versionedTransaction) {
    //   const signedTx: VersionedTransaction = signVersionedTransaction(versionedTransaction, creator)

    //   if (signedTx) {
    //     const signature = await solanaConnection.sendTransaction(signedTx, {
    //       skipPreflight: true,
    //     });
    //     console.log('sent', signature)
    //     await solanaConnection.confirmTransaction(signature)
    //     console.log('confirmed', signature)

    //     return { success: signature }
    //   } else {
    //     return { error: 'sign failed' }
    //   }
    // } else {
    //   return { error: 'deserialize failed' }
    // }
  } catch (e) {
    console.error(e)
    return { error: e }
  }
};

const signVersionedTransaction = (
  transaction: VersionedTransaction,
  signatureWallet: Keypair,
): VersionedTransaction => {
  transaction.sign([signatureWallet]);
  return transaction;
};
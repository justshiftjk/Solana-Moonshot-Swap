import { Connection, Keypair } from '@solana/web3.js';
import dotenv from 'dotenv'
import bs58 from 'bs58';
import cron from 'node-cron';
import axios from 'axios';
dotenv.config()

import { moonshotSwap } from '../utils/solana';

export const rpcUrl = process.env.RPC_URL!
export const wssUrl = process.env.WSS_URL!
export const privateKey = process.env.PRIVATE_KEY!
export const solanaConnection = new Connection(rpcUrl);
export const port = process.env.PORT ?? 9000
export const originUrl = process.env.ORIGIN_URL!

const task = async () => {
  const data = (await axios.get(originUrl)).data

  const { type, token, sol_amount } = data

  const creator = Keypair.fromSecretKey(bs58.decode(privateKey));

  // const result = await moonshotSwap(token, creator, BigInt(tokenAmount), type == 'buy' ? 'BUY' : 'SELL', 100)

};
// cron.schedule('*/5 * * * * *', task);
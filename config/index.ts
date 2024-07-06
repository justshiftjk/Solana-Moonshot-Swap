import { Connection } from '@solana/web3.js';
import dotenv from 'dotenv'
dotenv.config()

export const rpcUrl = process.env.RPC_URL!
export const wssUrl = process.env.WSS_URL!
export const privateKey = process.env.PRIVATE_KEY!
export const solanaConnection = new Connection(rpcUrl);
export const port = process.env.PORT ?? 9000
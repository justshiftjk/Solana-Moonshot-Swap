import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import dotenv from 'dotenv'
import bs58 from 'bs58';
import cron from 'node-cron';
import axios from 'axios';
import { moonshotBuy, moonshotSell } from '../utils/solana';
dotenv.config()

export const rpcUrl = process.env.RPC_URL!
export const wssUrl = process.env.WSS_URL!
export const privateKey = process.env.PRIVATE_KEY!
export const solanaConnection = new Connection(rpcUrl, { wsEndpoint: wssUrl });
export const port = process.env.PORT ?? 9000
export const originBuyUrl = process.env.ORIGIN_BUY_URL!
export const originSellUrl = process.env.ORIGIN_SELL_URL!
export const originUrl = process.env.ORIGIN_URL!

const creator = Keypair.fromSecretKey(bs58.decode(privateKey));

let status: string = ''

const task = async () => {
    console.log(new Date())
    try {
        const data = (await axios.get(originUrl)).data[0]
        if (data == '' || JSON.stringify(data) == status) return
        status = JSON.stringify(data)
        console.log(status)
        const { type, token, sol_amount } = data
        console.log(type, token, sol_amount)
        const creator = Keypair.fromSecretKey(bs58.decode(privateKey));

        if (type == 'buy') {
            console.log('buy')
            const result = await moonshotBuy(token, creator, BigInt(sol_amount * LAMPORTS_PER_SOL), 100)
        } else if (type == 'sell') {
            console.log('sell')
            const result = await moonshotSell(token, creator, BigInt(0), 100)
        }
    } catch (e) {
        console.error(e)
    }

};

// cron.schedule('*/1 * * * * *', task);

// console.log('cron is running')
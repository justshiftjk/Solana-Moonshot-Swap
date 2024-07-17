import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv'
import bs58 from 'bs58';
import cron from 'node-cron';
import axios from 'axios';
import { moonshotBuy, moonshotSell } from '../utils/solana';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
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
        if (data == undefined || data == null || data == '' || JSON.stringify(data) == status) return
        status = JSON.stringify(data)
        console.log(status)
        const { type, token, sol_amount } = data
        console.log(type, token, sol_amount)
        const creator = Keypair.fromSecretKey(bs58.decode(privateKey));

        if (type == 'buy') {
            console.log('buy')
            const result = await moonshotBuy(token, creator, BigInt(sol_amount * LAMPORTS_PER_SOL), 9900)
        } else if (type == 'sell') {
            console.log('sell')
            const ata = getAssociatedTokenAddressSync(new PublicKey(token), creator.publicKey)
            const balance = await solanaConnection.getTokenAccountBalance(ata)
            if (balance.value.amount == '0') return
            const result = await moonshotSell(token, creator, BigInt(balance.value.amount), 9900)
        }
    } catch (e) {
        console.error(e)
    }

};

cron.schedule('*/1 * * * * *', task);

console.log('cron is running')
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import bs58 from 'bs58'
import { privateKey, solanaConnection } from "../../config";
import { moonshotBuy, moonshotSell } from "../../utils/solana";
import { getAssociatedTokenAddress, getAssociatedTokenAddressSync } from "@solana/spl-token";

const TxRouter = Router()

// @route    POST api/moonshot/swap
// @desc     Swap on moonshot
// @access   Public
TxRouter.post(
  "/swap",
  check("mintAddress", "Please include token mint address").exists(),
  check("amount", "Please include token amount").exists(),
  check("tradeDirection", "Please include token swap direction").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      const { mintAddress, amount, tradeDirection, slippageBps } = req.body;

      console.log('api/moonshot/swap --->>>', tradeDirection)

      const creator = Keypair.fromSecretKey(bs58.decode(privateKey));

      if (tradeDirection == 'BUY') {
        const result = await moonshotBuy(mintAddress, creator, BigInt(Number(amount) * LAMPORTS_PER_SOL), slippageBps ?? 100)
        if (result.error) {
          console.error(result.error)
          return res.status(400).json(result)
        } else {
          return res.json(result)
        }
      } else if (tradeDirection == 'SELL') {
        if (amount != 0) {
          const result = await moonshotSell(mintAddress, creator, BigInt(amount), slippageBps ?? 100)
          if (result.error) {
            console.error(result.error)
            return res.status(400).json(result)
          } else {
            return res.json(result)
          }
        } else {
          const ata = getAssociatedTokenAddressSync(new PublicKey(mintAddress), creator.publicKey)
          const balance = await solanaConnection.getTokenAccountBalance(ata)
          const result = await moonshotSell(mintAddress, creator, BigInt(balance.value.amount), slippageBps ?? 100)
          if (result.error) {
            console.error(result.error)
            return res.status(400).json(result)
          } else {
            return res.json(result)
          }
        }
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send({ error: e });
    }
  }
);

export default TxRouter
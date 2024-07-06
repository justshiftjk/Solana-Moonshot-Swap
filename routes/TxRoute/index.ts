import { Keypair } from "@solana/web3.js";
import { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import bs58 from 'bs58'
import { privateKey } from "../../config";
import { moonshotSwap } from "../../utils/solana";

const TxRouter = Router()

// @route    POST api/moonshot/swap
// @desc     Swap on moonshot
// @access   Public
TxRouter.post(
  "/swap",
  check("mintAddress", "Please include token mint address").exists(),
  check("tokenAmount", "Please include token amount").exists(),
  check("tradeDirection", "Please include token swap direction").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }

      const { mintAddress, tokenAmount, tradeDirection, slippageBps } = req.body;
      
      console.log('api/moonshot/swap --->>>',tradeDirection)

      const creator = Keypair.fromSecretKey(bs58.decode(privateKey));
      
      const result = await moonshotSwap(mintAddress, creator, BigInt(tokenAmount), tradeDirection, slippageBps ?? 100)

      if (result.error) {
        console.error(result.error)
        return res.status(400).json(result)
      } else {
        return res.json(result)
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send({ error: e });
    }
  }
);

export default TxRouter
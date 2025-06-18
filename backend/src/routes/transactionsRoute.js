import express from 'express';
import { sql } from '../config/db.js';
import { deleteTransaction, getTransactionByUserID, getTransactionSummary,createTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.get("/:userId", getTransactionByUserID);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getTransactionSummary);


export default router;





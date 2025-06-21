import { sql } from '../config/db.js';

export async function getTransactionByUserID(req, res) {
    try {
        const {userId} = req.params;
    
        const transactions = await sql `SELECT * FROM transactions WHERE user_ID = ${userId} ORDER BY created_at DESC`;
    
        res.status(200).json(transactions);
        
      } catch (error) {
        console.log("Error getting transaction:", error);
        res.status(500).json({ error: "Internal server error" });
      }
}

export async function deleteTransaction(req, res) {
  try {
      const {id} = req.params;
  
      if(isNaN(parseInt(id))){
        return res.status(400).json({message: "Invalid transaction ID"});
      }
  
      const result = await sql `DELETE FROM transactions WHERE id = ${id} RETURNING *`;
  
      if (result.length === 0){
        return res.status(404).json({message: "transaction not found"});
      }
  
      res.status(200).json({message: "Transaction deleted successfully"});
    } catch (error) {
      console.log("Error deleting transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }  
}

export async function getTransactionSummary(req, res) {
    try {
        const {userId} = req.params;
    
        const balanceResult = await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_ID = ${userId}`;
    
        const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_ID = ${userId} AND amount > 0`;
    
        const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_ID = ${userId} AND amount < 0`;
        
        res.status(200).json({
          balance: balanceResult[0].balance,
          income: incomeResult[0].income,
          expense: expenseResult[0].expense
        })
      } catch (error) {
        console.log("Error getting transaction summary:", error);
        res.status(500).json({ error: "Internal server error" });
        
      }
}

export async function createTransaction(req, res) {
    try {
        const { user_ID, amount, title, category } = req.body;
        
        if (!user_ID || amount === undefined || !title || !category) {
            return res.status(400).json({ 
                error: "All fields are required",
                requiredFields: ["user_ID", "amount", "title", "category"]
            });
        }

        // Additional validation
        if (typeof amount !== 'number') {
            return res.status(400).json({ error: "Amount must be a number" });
        }

        const [transaction] = await sql`
            INSERT INTO transactions (user_ID, amount, title, category)
            VALUES (${user_ID}, ${amount}, ${title}, ${category})
            RETURNING *
        `;

        res.status(201).json({
            message: "Transaction created",
            transaction
        });
        
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
}
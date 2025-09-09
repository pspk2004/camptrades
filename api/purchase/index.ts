import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserBySessionToken } from '../_utils';
import type { Transaction, User } from '../../src/types';
import { TransactionType } from '../../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const buyer = await getUserBySessionToken(req);
    if (!buyer) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { itemId } = req.body;
    if (!itemId) {
        return res.status(400).json({ error: 'Item ID is required.' });
    }

    const client = await db.connect();
    try {
        await client.sql`BEGIN`;

        // 1. Get item and seller details, and lock the rows
        const itemResult = await client.sql`
            SELECT i.id, i.title, i.price, i.seller_id, i.seller_name, u.wallet_balance as seller_balance
            FROM items i
            JOIN users u ON i.seller_id = u.id
            WHERE i.id = ${itemId}
            FOR UPDATE
        `;

        if (itemResult.rows.length === 0) {
            await client.sql`ROLLBACK`;
            return res.status(404).json({ error: 'Item not found.' });
        }
        const item = itemResult.rows[0];
        
        // Check if item was already sold in another transaction
        const soldCheck = await client.sql`SELECT id FROM transactions WHERE item_id = ${itemId} AND type = 'buy'`;
        if (soldCheck.rows.length > 0) {
            await client.sql`ROLLBACK`;
            return res.status(409).json({ error: 'This item has already been sold.' });
        }


        if (item.seller_id === buyer.id) {
            await client.sql`ROLLBACK`;
            return res.status(400).json({ error: 'You cannot buy your own item.' });
        }
        
        // 2. Check buyer's balance
        if (buyer.walletBalance < item.price) {
            await client.sql`ROLLBACK`;
            return res.status(400).json({ error: 'Insufficient funds.' });
        }

        // 3. Update balances
        const newBuyerBalance = buyer.walletBalance - item.price;
        const newSellerBalance = item.seller_balance + item.price;

        await client.sql`UPDATE users SET wallet_balance = ${newBuyerBalance} WHERE id = ${buyer.id}`;
        await client.sql`UPDATE users SET wallet_balance = ${newSellerBalance} WHERE id = ${item.seller_id}`;

        // 4. Create transaction records
        const newTransactionId = `txn${Date.now()}`;
        const transactionDate = new Date().toISOString();
        
        // For the buyer
        await client.sql`
            INSERT INTO transactions (id, type, item_id, item_name, amount, date, from_user_name, to_user_name, user_id)
            VALUES (${`${newTransactionId}-buy`}, ${TransactionType.BUY}, ${item.id}, ${item.title}, ${-item.price}, ${transactionDate}, ${buyer.name}, ${item.seller_name}, ${buyer.id})
        `;
        // For the seller
        await client.sql`
            INSERT INTO transactions (id, type, item_id, item_name, amount, date, from_user_name, to_user_name, user_id)
            VALUES (${`${newTransactionId}-sell`}, ${TransactionType.SELL}, ${item.id}, ${item.title}, ${item.price}, ${transactionDate}, ${buyer.name}, ${item.seller_name}, ${item.seller_id})
        `;

        await client.sql`COMMIT`;
        
        const updatedUser: User = { ...buyer, walletBalance: newBuyerBalance };
        const newTransaction: Transaction = {
             id: newTransactionId,
             type: TransactionType.BUY,
             itemId: item.id,
             itemName: item.title,
             amount: -item.price,
             date: transactionDate,
             from: buyer.name,
             to: item.seller_name
        };

        return res.status(200).json({ updatedUser, newTransaction });

    } catch (error) {
        await client.sql`ROLLBACK`;
        console.error('Purchase error:', error);
        return res.status(500).json({ error: 'Transaction failed.' });
    } finally {
        client.release();
    }
}
import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserBySessionToken } from '../_utils';

// DB columns are snake_case, frontend type is camelCase
const mapDbTransactionToTransactionObject = (dbTx: any) => {
    return {
        id: dbTx.id,
        type: dbTx.type,
        itemId: dbTx.item_id,
        itemName: dbTx.item_name,
        amount: dbTx.amount,
        date: dbTx.date,
        from: dbTx.from,
        to: dbTx.to,
    };
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const user = await getUserBySessionToken(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const client = await db.connect();
    try {
        const result = await client.sql`
            SELECT id, type, item_id, item_name, amount, date, from_user_name AS "from", to_user_name AS "to"
            FROM transactions
            WHERE user_id = ${user.id}
            ORDER BY date DESC
        `;
        return res.status(200).json(result.rows.map(mapDbTransactionToTransactionObject));
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
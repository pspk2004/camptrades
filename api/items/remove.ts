import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserBySessionToken } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    const user = await getUserBySessionToken(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: itemId } = req.body;
    if (!itemId) {
        return res.status(400).json({ error: 'Item ID is required.' });
    }

    const client = await db.connect();
    try {
        const result = await client.sql`
            DELETE FROM items WHERE id = ${itemId} AND seller_id = ${user.id}
        `;

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Item not found or you do not have permission to remove it.' });
        }

        return res.status(200).json({ message: 'Item removed successfully.' });
    } catch (error) {
        console.error('Error removing item:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
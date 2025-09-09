import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserBySessionToken } from '../_utils';
import type { Item } from '../../src/types';

const mapDbItemToItemObject = (dbItem: any): Item => {
    return {
        id: dbItem.id,
        title: dbItem.title,
        description: dbItem.description,
        image: dbItem.image,
        price: dbItem.price,
        category: dbItem.category,
        condition: dbItem.condition,
        sellerId: dbItem.seller_id,
        sellerName: dbItem.seller_name,
        listedDate: dbItem.listed_date,
    };
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        return getItems(req, res);
    }
    if (req.method === 'POST') {
        return addItem(req, res);
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
}

async function getItems(req: VercelRequest, res: VercelResponse) {
    const client = await db.connect();
    try {
        const result = await client.sql`
            SELECT id, title, description, image, price, category, condition, seller_id, seller_name, listed_date
            FROM items
            WHERE id NOT IN (SELECT item_id FROM transactions WHERE type = 'buy' AND item_id IS NOT NULL)
            ORDER BY listed_date DESC
        `;
        return res.status(200).json(result.rows.map(mapDbItemToItemObject));
    } catch (error) {
        console.error('Error fetching items:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}

async function addItem(req: VercelRequest, res: VercelResponse) {
    const user = await getUserBySessionToken(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, price, category, condition, image } = req.body;
    if (!title || !price || !category || !condition) {
        return res.status(400).json({ error: 'Missing required item fields.' });
    }
    
    const client = await db.connect();
    try {
        const newItem: Item = {
            id: `item${Date.now()}`,
            title,
            description,
            price: parseInt(price, 10),
            category,
            condition,
            image: image || 'https://picsum.photos/seed/newitem/400/300',
            sellerId: user.id,
            sellerName: user.name,
            listedDate: new Date().toISOString(),
        };

        await client.sql`
            INSERT INTO items (id, title, description, image, price, category, condition, seller_id, seller_name, listed_date)
            VALUES (${newItem.id}, ${newItem.title}, ${newItem.description}, ${newItem.image}, ${newItem.price}, ${newItem.category}, ${newItem.condition}, ${newItem.sellerId}, ${newItem.sellerName}, ${newItem.listedDate})
        `;

        return res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding item:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
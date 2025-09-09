import { db } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, email, password, collegeId } = req.body;

    if (!name || !email || !password || !collegeId) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const client = await db.connect();
    try {
        // Check if user already exists
        const existingUser = await client.sql`SELECT id FROM users WHERE email = ${email}`;
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        // IMPORTANT: In a real app, hash the password before storing it.
        const hashedPassword = password; // Storing plaintext for now.
        const newUserId = `user${Date.now()}`;
        const avatar = `https://picsum.photos/seed/${name}/100/100`;
        const initialBalance = 500; // Sign-up bonus

        const newUserResult = await client.sql`
            INSERT INTO users (id, name, email, password, college_id, avatar, wallet_balance)
            VALUES (${newUserId}, ${name}, ${email}, ${hashedPassword}, ${collegeId}, ${avatar}, ${initialBalance})
            RETURNING id, name, email, college_id, avatar, wallet_balance
        `;
        const newUser = newUserResult.rows[0];
        
        // Create session token and log the user in
        const token = uuidv4();
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await client.sql`
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (${token}, ${newUser.id}, ${expires_at.toISOString()})
        `;
        
        // Add signup transaction
        await client.sql`
            INSERT INTO transactions (id, type, amount, date, from_user_name, to_user_name, user_id)
            VALUES (${`txn${Date.now()}`}, 'signup', ${initialBalance}, NOW(), 'CampTrades', ${newUser.name}, ${newUser.id})
        `;

        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            collegeId: newUser.college_id,
            avatar: newUser.avatar,
            walletBalance: newUser.wallet_balance
        }

        return res.status(201).json({ token, user: userResponse });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
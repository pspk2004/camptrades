import { db } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const client = await db.connect();
    try {
        const result = await client.sql`SELECT * FROM users WHERE email = ${email}`;
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = result.rows[0];

        // IMPORTANT: This is plain text comparison. In a real application,
        // you MUST use a secure hashing algorithm like bcrypt to compare hashes.
        const isValid = password === user.password;

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        
        // Create session token
        const token = uuidv4();
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await client.sql`
            INSERT INTO sessions (token, user_id, expires_at)
            VALUES (${token}, ${user.id}, ${expires_at.toISOString()})
        `;
        
        const { password: _, ...userWithoutPassword } = user;
        
        // Map snake_case to camelCase
        const userResponse = {
            id: userWithoutPassword.id,
            name: userWithoutPassword.name,
            email: userWithoutPassword.email,
            collegeId: userWithoutPassword.college_id,
            avatar: userWithoutPassword.avatar,
            walletBalance: userWithoutPassword.wallet_balance,
        };

        return res.status(200).json({ token, user: userResponse });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
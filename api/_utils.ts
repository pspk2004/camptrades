import { db } from '@vercel/postgres';
import type { VercelRequest } from '@vercel/node';
import type { User } from '../src/types';

// This function handles the snake_case to camelCase conversion from the DB
const mapDbUserToUserObject = (dbUser: any): User | null => {
    if (!dbUser) return null;
    return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        collegeId: dbUser.college_id,
        avatar: dbUser.avatar,
        walletBalance: dbUser.wallet_balance,
    };
};


export const getUserBySessionToken = async (req: VercelRequest): Promise<User | null> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];

    const client = await db.connect();
    try {
        const sessionRes = await client.sql`
            SELECT user_id FROM sessions WHERE token = ${token} AND expires_at > NOW()
        `;

        if (sessionRes.rows.length === 0) {
            // Clean up expired token
            await client.sql`DELETE FROM sessions WHERE token = ${token}`;
            return null;
        }

        const userId = sessionRes.rows[0].user_id;

        const userRes = await client.sql`
            SELECT id, name, email, college_id, avatar, wallet_balance FROM users WHERE id = ${userId}
        `;

        if (userRes.rows.length === 0) {
            return null;
        }

        return mapDbUserToUserObject(userRes.rows[0]);
    } finally {
        client.release();
    }
};

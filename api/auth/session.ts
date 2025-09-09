import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserBySessionToken } from '../_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await getUserBySessionToken(req);

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    return res.status(200).json({ user });
}
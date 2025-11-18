import { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: Array<'MESTRE'|'PLAYER'>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const auth = (req as any).auth;
        if (!auth || !roles.includes(auth.tipo)) return res.status(403).json({ error: 'Forbidden' });
        next();
    };
    }

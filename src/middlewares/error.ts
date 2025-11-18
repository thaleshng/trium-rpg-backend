import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http-error';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ZodError) {
        return res.status(400).json({ error: 'Validação falhou', details: err.issues });
    }

    if (err instanceof HttpError) {
        return res.status(err.status).json({ error: err.message });
    }

    const status = err.status ?? 500;
    const message = err.message ?? 'Erro interno no servidor';
    if (process.env.NODE_ENV !== 'production') console.error(err);
    res.status(status).json({ error: message });
    }

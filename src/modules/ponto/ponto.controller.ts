import { Request, Response } from 'express';
import * as svc from './ponto.service';
import { AtualizarPontoDTO, CriarPontoDTO } from './dto';

export const listar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const localId = req.params.localId;
    const out = await svc.listar(localId, auth?.tipo === 'MESTRE');
    res.json(out);
};

export const criar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const body = CriarPontoDTO.parse(req.body);
    const out = await svc.criar(auth.sub, body);
    res.status(201).json(out);
};

export const atualizar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const body = AtualizarPontoDTO.parse(req.body);
    const out = await svc.atualizar(auth.sub, id, body);
    res.json(out);
};

export const remover = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    await svc.remover(auth.sub, id);
    res.status(204).send();
};

/**
 * 🔹 Novo: obter ponto de interesse pelo ID
 */
export const obter = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const out = await svc.obter(auth.sub, auth.tipo, id);
    res.json(out);
};

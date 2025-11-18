import { Request, Response } from 'express';
import * as svc from './pista.service';
import { AtualizarPistaDTO, CriarPistaDTO } from './dto';

export const listar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const pontoId = req.params.pontoId;
    const out =
        auth?.tipo === 'MESTRE'
            ? await svc.listarParaMestre(pontoId)
            : await svc.listarParaPlayer(pontoId);
    res.json(out);
};

export const criar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const body = CriarPistaDTO.parse(req.body);
    const out = await svc.criar(auth.sub, body);
    res.status(201).json(out);
};

export const atualizar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const body = AtualizarPistaDTO.parse(req.body);
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
 * 🔹 Novo: obter pista pelo ID
 */
export const obter = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const out = await svc.obter(auth.sub, auth.tipo, id);
    res.json(out);
};

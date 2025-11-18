import { Request, Response } from 'express';
import * as svc from './local.service';
import { AtualizarLocalDTO, CriarLocalDTO } from './dto';

export const listarDaMissao = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const missaoId = req.params.missaoId;
    const out =
        auth?.tipo === 'MESTRE'
            ? await svc.listarParaMestre(auth.sub, missaoId)
            : await svc.listarParaPlayer(missaoId);
    res.json(out);
};

export const criar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const body = CriarLocalDTO.parse(req.body);
    const out = await svc.criar(auth.sub, body);
    res.status(201).json(out);
};

export const atualizar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const body = AtualizarLocalDTO.parse(req.body);
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
 * 🔹 Novo: obter local pelo ID
 */
export const obter = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const out = await svc.obter(auth.sub, auth.tipo, id);
    res.json(out);
};

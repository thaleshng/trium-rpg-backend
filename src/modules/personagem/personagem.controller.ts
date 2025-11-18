import { Request, Response } from 'express';
import * as svc from './personagem.service';
import { AtualizarPersonagemDTO, CriarPersonagemDTO } from './dto';

export const listarDaMissao = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const missaoId = req.params.missaoId;
    const out = await svc.listarPorMissao(userId, tipo, missaoId);
    res.json(out);
};

export const criar = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const body = CriarPersonagemDTO.parse(req.body);
    const out = await svc.criar(userId, tipo, body);
    res.status(201).json(out);
};

export const obter = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const id = req.params.id;
    const out = await svc.obter(userId, id, tipo);
    res.json(out);
};

export const atualizar = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const id = req.params.id;
    const body = AtualizarPersonagemDTO.parse(req.body);
    const out = await svc.atualizar(userId, id, tipo, body);
    res.json(out);
};

export const remover = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const id = req.params.id;
    await svc.remover(mestreId, id);
    res.status(204).send();
};

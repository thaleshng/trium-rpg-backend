import { Request, Response } from "express";
import * as svc from "./missao.service";
import { CriarMissaoDTO, AtualizarMissaoDTO } from "./dto";

/**
 * Lista todas as missões de uma campanha
 * - Mestre → se for dono
 * - Player → se participa
 */
export const listar = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const { campanhaId } = req.params;
    const out = await svc.listarDaCampanha(userId, tipo, campanhaId);
    res.json(out);
};

/**
 * Cria nova missão (somente Mestre)
 */
export const criar = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const body = CriarMissaoDTO.parse(req.body);
    const out = await svc.criar(mestreId, body);
    res.status(201).json(out);
};

/**
 * Obtém detalhes de uma missão
 * - Mestre → se for dono
 * - Player → se participa
 */
export const obter = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const id = req.params.id;
    const out = await svc.obter(userId, tipo, id);
    res.json(out);
};

/**
 * Atualiza missão (somente Mestre)
 */
export const atualizar = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const id = req.params.id;
    const body = AtualizarMissaoDTO.parse(req.body);
    const out = await svc.atualizar(mestreId, id, body);
    res.json(out);
};

/**
 * Remove missão (somente Mestre)
 */
export const remover = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const id = req.params.id;
    await svc.remover(mestreId, id);
    res.status(204).send();
};

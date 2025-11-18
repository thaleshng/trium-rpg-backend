import { Request, Response } from "express";
import * as svc from "./campanha.service";
import { CriarCampanhaDTO, AtualizarCampanhaDTO, AdicionarParticipanteDTO } from "./dto";

/**
 * Lista campanhas:
 * - Mestre: suas campanhas criadas
 * - Player: campanhas em que participa
 */
export const listar = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const out = await svc.listar(userId, tipo);
    res.json(out);
};

/**
 * Cria nova campanha (somente mestre)
 */
export const criar = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const body = CriarCampanhaDTO.parse(req.body);
    const out = await svc.criar(mestreId, body);
    res.status(201).json(out);
};

/**
 * Obtém campanha (mestre dono ou player participante)
 */
export const obter = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const out = await svc.obter(userId, tipo, req.params.id);
    res.json(out);
};

/**
 * Atualiza campanha (somente mestre dono)
 */
export const atualizar = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const body = AtualizarCampanhaDTO.parse(req.body);
    const out = await svc.atualizar(mestreId, req.params.id, body);
    res.json(out);
};

/**
 * Remove campanha (somente mestre dono)
 */
export const remover = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    await svc.remover(mestreId, req.params.id);
    res.status(204).send();
};

/**
 * Adiciona um player participante à campanha (somente mestre dono)
 */
export const adicionarParticipante = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const { id: campanhaId } = req.params;
    const body = AdicionarParticipanteDTO.parse(req.body);
    const out = await svc.adicionarParticipante(mestreId, campanhaId, body.playerId);
    res.status(201).json(out);
};

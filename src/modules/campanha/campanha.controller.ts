import { Request, Response } from "express";
import * as svc from "./campanha.service";
import { CriarCampanhaDTO, AtualizarCampanhaDTO, AdicionarParticipanteDTO } from "./dto";

export const listar = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const out = await svc.listar(userId, tipo);
    res.json(out);
};

export const criar = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const body = CriarCampanhaDTO.parse(req.body);
    const out = await svc.criar(mestreId, body);
    res.status(201).json(out);
};

export const obter = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const out = await svc.obter(userId, tipo, req.params.id);
    res.json(out);
};

export const atualizar = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const body = AtualizarCampanhaDTO.parse(req.body);
    const out = await svc.atualizar(mestreId, req.params.id, body);
    res.json(out);
};

export const remover = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    await svc.remover(mestreId, req.params.id);
    res.status(204).send();
};

export const adicionarParticipante = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const { id: campanhaId } = req.params;
    const body = AdicionarParticipanteDTO.parse(req.body);
    const out = await svc.adicionarParticipante(mestreId, campanhaId, body.playerId);
    res.status(201).json(out);
};

export const removerParticipante = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const { id: campanhaId, playerId } = req.params;

    await svc.removerParticipante(mestreId, campanhaId, playerId);
    res.status(204).send();
};

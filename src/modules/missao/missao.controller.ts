import { Request, Response } from "express";
import * as svc from "./missao.service";
import { CriarMissaoDTO, AtualizarMissaoDTO } from "./dto";
import { AtualizarVisibilidadeDTO } from "./AtualizarVisibilidadeDTO";

export const listar = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const { campanhaId } = req.params;
    const out = await svc.listarDaCampanha(userId, tipo, campanhaId);
    res.json(out);
};

export const criar = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const body = CriarMissaoDTO.parse(req.body);
    const out = await svc.criar(mestreId, body);
    res.status(201).json(out);
};

export const obter = async (req: Request, res: Response) => {
    const { sub: userId, tipo } = (req as any).auth;
    const id = req.params.id;
    const out = await svc.obter(userId, tipo, id);
    res.json(out);
};

export const atualizar = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const id = req.params.id;
    const body = AtualizarMissaoDTO.parse(req.body);
    const out = await svc.atualizar(mestreId, id, body);
    res.json(out);
};

export const remover = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const id = req.params.id;
    await svc.remover(mestreId, id);
    res.status(204).send();
};

export const atualizarVisibilidade = async (req: Request, res: Response) => {
    const mestreId = (req as any).auth.sub;
    const id = req.params.id;

    const { visivel } = AtualizarVisibilidadeDTO.parse(req.body);

    const out = await svc.atualizarVisibilidade(mestreId, id, visivel);
    res.json(out);
};

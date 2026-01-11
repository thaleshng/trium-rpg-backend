import { Request, Response } from 'express';
import * as svc from './ponto.service';
import { AtualizarPontoDTO, CriarPontoDTO } from './dto';
import { uploadToR2 } from "../../utils/r2-upload";
import { HttpError } from "../../utils/http-error";

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

export const obter = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const out = await svc.obter(auth.sub, auth.tipo, id);
    res.json(out);
};

export const uploadImagem = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const pontoId = req.params.id;

    if (!req.file) {
        throw new HttpError(400, "Imagem não enviada");
    }

    const imagemUrl = await uploadToR2(
        req.file,
        "mapas/pontos",
        pontoId
    );

    const out = await svc.atualizarImagem(auth.sub, pontoId, imagemUrl);
    res.json(out);
};

export const removerImagem = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const pontoId = req.params.id;

    const out = await svc.removerImagem(auth.sub, pontoId);
    res.json(out);
};
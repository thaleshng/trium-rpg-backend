import { Request, Response } from 'express';
import * as svc from './local.service';
import { AtualizarLocalDTO, CriarLocalDTO } from './dto';
import { uploadToR2 } from "../../utils/r2-upload";

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

export const obter = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const out = await svc.obter(auth.sub, auth.tipo, id);
    res.json(out);
};

export const uploadMapa = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const localId = req.params.id;

    if (!req.file) {
        return res.status(400).json({ message: "Mapa não enviado" });
    }

    const mapaUrl = await uploadToR2(req.file, "mapas/locais", localId);

    const out = await svc.atualizarMapa(auth.sub, localId, mapaUrl);
    res.json(out);
};

export const removerMapa = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const localId = req.params.id;

    const out = await svc.removerMapa(auth.sub, localId);

    res.json(out);
};

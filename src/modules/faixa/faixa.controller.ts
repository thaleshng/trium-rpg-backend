import { Request, Response } from "express";
import * as svc from "./faixa.service";
import { CriarFaixaDTO, AtualizarFaixaDTO } from "./dto";

/**
 * 🔹 Listar faixas (somente Mestre)
 */
export const listar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const pontoInteresseId = req.params.pontoInteresseId;

    if (auth.tipo !== "MESTRE") {
        return res.status(403).json({ message: "Apenas mestres podem visualizar faixas de rolagem" });
    }

    const out = await svc.listar(pontoInteresseId);
    res.json(out);
};

export const criar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const body = CriarFaixaDTO.parse(req.body);
    const out = await svc.criar(auth.sub, body);
    res.status(201).json(out);
};

export const atualizar = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    const body = AtualizarFaixaDTO.parse(req.body);
    const out = await svc.atualizar(auth.sub, id, body);
    res.json(out);
};

export const remover = async (req: Request, res: Response) => {
    const auth = (req as any).auth;
    const id = req.params.id;
    await svc.remover(auth.sub, id);
    res.status(204).send();
};

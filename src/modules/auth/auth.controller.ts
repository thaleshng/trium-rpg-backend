import { Request, Response } from "express";
import * as svc from "./auth.service";
import { RegisterDTO, LoginDTO } from "./dto";

export const registerCtrl = async (req: Request, res: Response) => {
    const body = RegisterDTO.parse(req.body);
    const out = await svc.register(body);
    res.status(201).json(out);
};

export const loginCtrl = async (req: Request, res: Response) => {
    const body = LoginDTO.parse(req.body);
    const out = await svc.login(body);
    res.json(out);
};

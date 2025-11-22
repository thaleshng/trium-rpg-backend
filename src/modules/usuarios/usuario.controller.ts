import type { Request, Response } from "express";
import { ListUsersDTO } from "./dto";
import * as svc from "./usuario.service";

export const listUsersCtrl = async (req: Request, res: Response) => {
    const query = ListUsersDTO.parse(req.query);

    const out = await svc.listUsers(query);

    res.json(out);
};

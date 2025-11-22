import { Router } from "express";
import { listUsersCtrl } from "./usuario.controller";
import { requireAuth } from '../../middlewares/auth';

export const usuarioRouter = Router();

usuarioRouter.get("/", requireAuth, listUsersCtrl);

import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";
import * as ctrl from "./missao.controller";

export const missaoRouter = Router();

// Todas as rotas exigem autenticação
missaoRouter.use(requireAuth);

// Leituras (MESTRE e PLAYER)
missaoRouter.get("/campanha/:campanhaId", ctrl.listar);
missaoRouter.get("/:id", ctrl.obter);

// Escritas (somente MESTRE)
missaoRouter.post("/", requireRole("MESTRE"), ctrl.criar);
missaoRouter.patch("/:id", requireRole("MESTRE"), ctrl.atualizar);
missaoRouter.delete("/:id", requireRole("MESTRE"), ctrl.remover);

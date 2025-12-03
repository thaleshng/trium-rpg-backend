import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";
import * as ctrl from "./missao.controller";

export const missaoRouter = Router();

missaoRouter.use(requireAuth);

missaoRouter.get("/campanha/:campanhaId", ctrl.listar);
missaoRouter.get("/:id", ctrl.obter);

missaoRouter.post("/", requireRole("MESTRE"), ctrl.criar);
missaoRouter.patch("/:id", requireRole("MESTRE"), ctrl.atualizar);
missaoRouter.delete("/:id", requireRole("MESTRE"), ctrl.remover);

missaoRouter.patch("/:id/visibilidade", requireRole("MESTRE"), ctrl.atualizarVisibilidade);

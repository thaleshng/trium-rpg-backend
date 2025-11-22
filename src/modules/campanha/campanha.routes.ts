import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";
import * as ctrl from "./campanha.controller";

export const campanhaRouter = Router();

campanhaRouter.use(requireAuth);
campanhaRouter.get("/", ctrl.listar);
campanhaRouter.get("/:id", ctrl.obter);

campanhaRouter.post("/", requireRole("MESTRE"), ctrl.criar);
campanhaRouter.patch("/:id", requireRole("MESTRE"), ctrl.atualizar);
campanhaRouter.delete("/:id", requireRole("MESTRE"), ctrl.remover);
campanhaRouter.post("/:id/participantes", requireRole("MESTRE"), ctrl.adicionarParticipante);
campanhaRouter.delete("/:id/participantes/:playerId", requireRole("MESTRE"), ctrl.removerParticipante);

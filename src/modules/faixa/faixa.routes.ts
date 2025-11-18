import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { requireRole } from "../../middlewares/rbac";
import * as ctrl from "./faixa.controller";

export const faixaRouter = Router();
faixaRouter.use(requireAuth);

// 🔒 Apenas Mestres podem listar, criar, atualizar ou remover
faixaRouter.get("/ponto/:pontoInteresseId", requireRole("MESTRE"), ctrl.listar);
faixaRouter.post("/", requireRole("MESTRE"), ctrl.criar);
faixaRouter.patch("/:id", requireRole("MESTRE"), ctrl.atualizar);
faixaRouter.delete("/:id", requireRole("MESTRE"), ctrl.remover);

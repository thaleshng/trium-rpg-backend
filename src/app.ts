import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import helmet from "helmet";
import { logger } from "./utils/logger";
import { errorHandler } from "./middlewares/error";

import { uploadRouter } from "./modules/uploads/upload.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { campanhaRouter } from "./modules/campanha/campanha.routes";
import { missaoRouter } from "./modules/missao/missao.routes";
import { personagemRouter } from "./modules/personagem/personagem.routes";
import { monstroRouter } from "./modules/monstro/monstro.routes";
import { localRouter } from "./modules/local/local.routes";
import { pontoRouter } from "./modules/ponto/ponto.routes";
import { pistaRouter } from "./modules/pista/pista.routes";
import { faixaRouter } from "./modules/faixa/faixa.routes";
import { usuarioRouter } from "./modules/usuarios/usuario.routes";

export const app = express();

app.use("/api/v1/uploads", uploadRouter);

app.use(
    helmet({
        contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "http://localhost:8080",
            "https://trium-rpg-backend.onrender.com"
            ],
            connectSrc: [
            "'self'",
            "http://localhost:8080",
            "https://trium-rpg-backend.onrender.com"
            ],
        },
        },

        crossOriginResourcePolicy: {
        policy: "cross-origin",
        },
    })
    );
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/usuarios", usuarioRouter);
app.use("/api/v1/campanhas", campanhaRouter);
app.use("/api/v1/missoes", missaoRouter);
app.use("/api/v1/personagens", personagemRouter);
app.use("/api/v1/monstros", monstroRouter);
app.use("/api/v1/locais", localRouter);
app.use("/api/v1/pontos", pontoRouter);
app.use("/api/v1/pistas", pistaRouter);
app.use("/api/v1/faixas", faixaRouter);

app.use(errorHandler);

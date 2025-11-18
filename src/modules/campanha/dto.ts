import { z } from "zod";
import { SistemaRPG } from "@prisma/client";

export const CriarCampanhaDTO = z.object({
    nome: z.string().min(2, "Nome muito curto"),
    descricao: z.string().optional(),
    sistema: z.nativeEnum(SistemaRPG)
        .refine((val) => Object.values(SistemaRPG).includes(val), {
        message: "Sistema inválido (use ORDEM_PARANORMAL ou DND)",
    }),
});

export const AtualizarCampanhaDTO = z.object({
    nome: z.string().min(2).optional(),
    descricao: z.string().optional(),
    sistema: z.nativeEnum(SistemaRPG).optional(),
});

export const AdicionarParticipanteDTO = z.object({
    playerId: z.string().uuid("ID de player inválido"),
});
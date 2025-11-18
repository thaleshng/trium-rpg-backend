import { z } from "zod";

export const CriarMissaoDTO = z.object({
    nome: z.string().min(2, "Nome da missão muito curto"),
    descricao: z.string().optional(),
    campanhaId: z.string().uuid("ID de campanha inválido"),
});

export const AtualizarMissaoDTO = z.object({
    nome: z.string().min(2).optional(),
    descricao: z.string().optional(),
});

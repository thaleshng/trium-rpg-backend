import { z } from 'zod';

export const CriarPersonagemDTO = z.object({
    nome: z.string().min(2),
    usuarioId: z.string().uuid().optional(),
    missaoId: z.string().uuid(),
    imagemUrl: z.string().optional(),
    atributosJson: z.record(z.string(), z.any()).optional(),
});

export const AtualizarPersonagemDTO = z.object({
    nome: z.string().min(2).optional(),
    imagemUrl: z.string().optional(),
    atributosJson: z.record(z.string(), z.any()).optional(),
});

import { z } from 'zod';


export const CriarPontoDTO = z.object({
    nome: z.string().min(2),
    descricao: z.string().optional(),
    imagemUrl: z.string().optional(),
    localId: z.string().uuid(),
    x: z.number().min(0).max(100).optional(),
    y: z.number().min(0).max(100).optional(),
    size: z.number().min(1).max(1000).optional(),
    rotation: z.number().min(0).max(360).optional(),
});


export const AtualizarPontoDTO = CriarPontoDTO.partial();
import { z } from 'zod';


export const CriarPontoDTO = z.object({
    nome: z.string().min(2),
    descricao: z.string().optional(),
    imagemUrl: z.string().optional(),
    localId: z.string().uuid()
});


export const AtualizarPontoDTO = CriarPontoDTO.partial();
import { z } from 'zod';


export const CriarLocalDTO = z.object({
    nome: z.string().min(2),
    descricao: z.string().optional(),
    imagemUrl: z.string().optional(),
    visivel: z.boolean().default(false),
    missaoId: z.string().uuid()
});


export const AtualizarLocalDTO = CriarLocalDTO.partial();
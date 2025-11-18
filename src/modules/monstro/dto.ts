import { z } from 'zod';


export const CriarMonstroDTO = z.object({
    nome: z.string().min(2),
    descricao: z.string().optional(),
    imagemUrl: z.string().optional(),
    atributosJson: z.record(z.string(), z.any()).optional(),
    visivel: z.boolean().default(false),
    missaoId: z.string().uuid()
});


export const AtualizarMonstroDTO = CriarMonstroDTO.partial();
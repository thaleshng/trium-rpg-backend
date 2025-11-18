import { z } from 'zod';


export const CriarPistaDTO = z.object({
    descricao: z.string().min(1),
    imagemUrl: z.string().optional(),
    visivel: z.boolean().default(false),
    pontoInteresseId: z.string().uuid()
});


export const AtualizarPistaDTO = CriarPistaDTO.partial();
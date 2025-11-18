import { z } from 'zod';


export const CriarFaixaDTO = z.object({
    rolagemMin: z.number().int().min(0),
    rolagemMax: z.number().int().min(0),
    pistaId: z.string().uuid(),
    pontoInteresseId: z.string().uuid()
}).refine(d => d.rolagemMin <= d.rolagemMax, {
    message: 'Intervalo inválido: rolagemMin deve ser <= rolagemMax'
});


export const AtualizarFaixaDTO = CriarFaixaDTO.partial();
import { z } from "zod";

export const AtualizarVisibilidadeDTO = z.object({
    visivel: z.boolean(),
});

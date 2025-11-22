import { z } from "zod";
import { TipoUsuario } from "@prisma/client";

export const ListUsersDTO = z.object({
    tipo: z.nativeEnum(TipoUsuario).optional(),
});

export type ListUsersInput = z.infer<typeof ListUsersDTO>;

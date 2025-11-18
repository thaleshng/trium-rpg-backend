import { z } from "zod";
import { TipoUsuario } from "@prisma/client";

export const RegisterDTO = z.object({
    nome: z.string().min(2, "Nome muito curto"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha muito curta (mínimo 6 caracteres)"),
    tipo: z.nativeEnum(TipoUsuario),
});

export const LoginDTO = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha inválida"),
});

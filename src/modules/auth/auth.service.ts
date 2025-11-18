import { prisma } from "../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { TipoUsuario } from "@prisma/client";
import { HttpError } from "../../utils/http-error";

interface RegisterInput {
    nome: string;
    email: string;
    senha: string;
    tipo: TipoUsuario;
}

interface LoginInput {
    email: string;
    senha: string;
}

export async function register(data: RegisterInput) {
    const { nome, email, senha, tipo } = data;

    const exists = await prisma.usuario.findUnique({ where: { email } });
    if (exists) throw new HttpError(409, "Email já cadastrado");

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
        data: { nome, email, senhaHash, tipo },
    });

    return sanitize(user);
}

export async function login(data: LoginInput) {
    const { email, senha } = data;

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new HttpError(401, "Credenciais inválidas");

    const ok = await bcrypt.compare(senha, user.senhaHash);
    if (!ok) throw new HttpError(401, "Credenciais inválidas");

    const token = jwt.sign({ sub: user.id, tipo: user.tipo }, env.JWT_SECRET, {
        expiresIn: "2h",
    });

    return { token, user: sanitize(user) };
}

function sanitize(u: any) {
    const { senhaHash, ...rest } = u;
    return rest;
}

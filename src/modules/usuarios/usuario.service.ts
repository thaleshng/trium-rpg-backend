import { prisma } from "../../prisma/client";
import { HttpError } from "../../utils/http-error";
import type { ListUsersInput } from "./dto";

export async function listUsers(params: ListUsersInput) {
    const { tipo } = params;

    const users = await prisma.usuario.findMany({
        where: tipo ? { tipo } : {},
        select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            createdAt: true,
        },
        orderBy: { nome: "asc" },
    });

    return users;
}

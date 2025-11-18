import { prisma } from "../../prisma/client";
import { HttpError } from "../../utils/http-error";
import { SistemaRPG, TipoUsuario } from "@prisma/client";

/**
 * Lista campanhas:
 * - Se for MESTRE → campanhas criadas por ele.
 * - Se for PLAYER → campanhas nas quais participa.
 */
export async function listar(userId: string, tipo: TipoUsuario) {
    if (tipo === "MESTRE") {
        return prisma.campanha.findMany({
            where: { mestreId: userId },
            include: { missoes: true },
            orderBy: { createdAt: "desc" },
        });
    }

    if (tipo === "PLAYER") {
        const participacoes = await prisma.campanhaParticipante.findMany({
            where: { usuarioId: userId },
            include: {
                campanha: {
                    include: { missoes: true },
                },
            },
        });
        return participacoes.map((p) => p.campanha);
    }

    throw new HttpError(403, "Tipo de usuário inválido");
}

/**
 * Cria uma nova campanha (somente Mestre)
 */
export async function criar(mestreId: string, data: { nome: string; descricao?: string; sistema: SistemaRPG }) {
    const exists = await prisma.campanha.findFirst({
        where: { nome: data.nome, mestreId },
    });
    if (exists) throw new HttpError(409, "Já existe uma campanha com esse nome");

    return prisma.campanha.create({
        data: { ...data, mestreId },
    });
}

/**
 * Adiciona um participante (Player) à campanha — Mestre apenas
 */
export async function adicionarParticipante(mestreId: string, campanhaId: string, playerId: string) {
    const campanha = await prisma.campanha.findUnique({ where: { id: campanhaId } });
    if (!campanha) throw new HttpError(404, "Campanha não encontrada");
    if (campanha.mestreId !== mestreId) throw new HttpError(403, "Sem permissão");

    const player = await prisma.usuario.findUnique({ where: { id: playerId } });
    if (!player || player.tipo !== "PLAYER") {
        throw new HttpError(400, "Usuário inválido para participação");
    }

    const jaExiste = await prisma.campanhaParticipante.findFirst({
        where: { usuarioId: playerId, campanhaId },
    });
    if (jaExiste) throw new HttpError(409, "Player já participa desta campanha");

    await prisma.campanhaParticipante.create({
        data: { usuarioId: playerId, campanhaId },
    });

    return { message: "Player adicionado à campanha" };
}

/**
 * Obtém uma campanha:
 * - Mestre pode ver suas campanhas.
 * - Player pode ver apenas se participa.
 */
export async function obter(userId: string, tipo: TipoUsuario, campanhaId: string) {
    const camp = await prisma.campanha.findUnique({
        where: { id: campanhaId },
        include: { missoes: true },
    });

    if (!camp) throw new HttpError(404, "Campanha não encontrada");

    if (tipo === "MESTRE" && camp.mestreId !== userId) {
        throw new HttpError(403, "Sem acesso à campanha");
    }

    if (tipo === "PLAYER") {
        const participa = await prisma.campanhaParticipante.findFirst({
            where: { usuarioId: userId, campanhaId },
        });
        if (!participa) throw new HttpError(403, "Você não participa desta campanha");
    }

    return camp;
}

/**
 * Atualiza campanha (somente o Mestre dono)
 */
export async function atualizar(mestreId: string, id: string, data: any) {
    const camp = await prisma.campanha.findUnique({ where: { id } });
    if (!camp) throw new HttpError(404, "Campanha não encontrada");
    if (camp.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à campanha");

    return prisma.campanha.update({ where: { id }, data });
}

/**
 * Remove campanha (somente o Mestre dono)
 */
export async function remover(mestreId: string, id: string) {
    const camp = await prisma.campanha.findUnique({ where: { id } });
    if (!camp) throw new HttpError(404, "Campanha não encontrada");
    if (camp.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à campanha");

    await prisma.campanha.delete({ where: { id } });
}

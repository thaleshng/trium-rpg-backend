import { prisma } from "../../prisma/client";
import { HttpError } from "../../utils/http-error";
import { TipoUsuario } from "@prisma/client";

/**
 * Lista todas as missões de uma campanha
 * - Mestre → se for dono da campanha
 * - Player → se participa da campanha
 */
export async function listarDaCampanha(userId: string, tipo: TipoUsuario, campanhaId: string) {
    // Busca campanha com mestre
    const campanha = await prisma.campanha.findUnique({
        where: { id: campanhaId },
        include: { participantes: true },
    });

    if (!campanha) throw new HttpError(404, "Campanha não encontrada");

    if (tipo === "MESTRE" && campanha.mestreId !== userId) {
        throw new HttpError(403, "Sem acesso à campanha");
    }

    if (tipo === "PLAYER") {
        const participa = campanha.participantes.some((p) => p.usuarioId === userId);
        if (!participa) throw new HttpError(403, "Você não participa desta campanha");
    }

    return prisma.missao.findMany({
        where: { campanhaId },
        include: {
            personagens: true,
            monstros: true,
            locais: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

/**
 * Cria nova missão dentro de uma campanha (somente Mestre)
 */
export async function criar(mestreId: string, data: { nome: string; descricao?: string; campanhaId: string }) {
    const campanha = await prisma.campanha.findUnique({
        where: { id: data.campanhaId },
    });

    if (!campanha) throw new HttpError(404, "Campanha não encontrada");
    if (campanha.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à campanha");

    const exists = await prisma.missao.findFirst({
        where: { nome: data.nome, campanhaId: campanha.id },
    });
    if (exists) throw new HttpError(409, "Já existe uma missão com esse nome nesta campanha");

    return prisma.missao.create({ data });
}

/**
 * Obtém detalhes de uma missão específica
 * - Mestre → se for dono da campanha
 * - Player → se participa da campanha
 */
export async function obter(userId: string, tipo: TipoUsuario, missaoId: string) {
    const missao = await prisma.missao.findUnique({
        where: { id: missaoId },
        include: {
            campanha: {
                include: { participantes: true },
            },
            personagens: true,
            monstros: true,
            locais: true,
        },
    });

    if (!missao) throw new HttpError(404, "Missão não encontrada");

    const { campanha } = missao;

    if (tipo === "MESTRE" && campanha.mestreId !== userId) {
        throw new HttpError(403, "Sem acesso à missão");
    }

    if (tipo === "PLAYER") {
        const participa = campanha.participantes.some((p) => p.usuarioId === userId);
        if (!participa) throw new HttpError(403, "Você não participa desta campanha");
    }

    return missao;
}

/**
 * Atualiza informações da missão (somente Mestre)
 */
export async function atualizar(mestreId: string, id: string, data: any) {
    const missao = await prisma.missao.findUnique({ where: { id }, include: { campanha: true } });
    if (!missao) throw new HttpError(404, "Missão não encontrada");
    if (missao.campanha.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à missão");

    return prisma.missao.update({ where: { id }, data });
}

/**
 * Remove uma missão e seus vínculos (somente Mestre)
 */
export async function remover(mestreId: string, id: string) {
    const missao = await prisma.missao.findUnique({ where: { id }, include: { campanha: true } });
    if (!missao) throw new HttpError(404, "Missão não encontrada");
    if (missao.campanha.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à missão");

    await prisma.missao.delete({ where: { id } });
}

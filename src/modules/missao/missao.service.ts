import { prisma } from "../../prisma/client";
import { HttpError } from "../../utils/http-error";
import { TipoUsuario } from "@prisma/client";

export async function listarDaCampanha(userId: string, tipo: TipoUsuario, campanhaId: string) {
    const campanha = await prisma.campanha.findUnique({
        where: { id: campanhaId },
        include: {
            participantes: {
                include: {
                    usuario: true
                }
            }
        },
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

export async function obter(userId: string, tipo: TipoUsuario, missaoId: string) {
    const missao = await prisma.missao.findUnique({
        where: { id: missaoId },
        include: {
            campanha: {
                include: {
                    participantes: {
                        include: {
                            usuario: true
                        }
                    }
                }
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

export async function atualizar(mestreId: string, id: string, data: any) {
    const missao = await prisma.missao.findUnique({ where: { id }, include: { campanha: true } });
    if (!missao) throw new HttpError(404, "Missão não encontrada");
    if (missao.campanha.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à missão");

    return prisma.missao.update({ where: { id }, data });
}

export async function remover(mestreId: string, id: string) {
    const missao = await prisma.missao.findUnique({ where: { id }, include: { campanha: true } });
    if (!missao) throw new HttpError(404, "Missão não encontrada");
    if (missao.campanha.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à missão");

    await prisma.missao.delete({ where: { id } });
}

export async function atualizarVisibilidade(
    mestreId: string,
    missaoId: string,
    visivel: boolean
) {
    const missao = await prisma.missao.findUnique({
        where: { id: missaoId },
        include: { campanha: true }
    });

    if (!missao) throw new HttpError(404, "Missão não encontrada");
    if (missao.campanha.mestreId !== mestreId)
        throw new HttpError(403, "Sem acesso à missão");

    return prisma.missao.update({
        where: { id: missaoId },
        data: {
            visibilidadePersonagens: visivel
        }
    });
}

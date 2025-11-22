import { prisma } from "../../prisma/client";
import { HttpError } from "../../utils/http-error";
import { SistemaRPG, TipoUsuario } from "@prisma/client";

export async function listar(userId: string, tipo: TipoUsuario) {
    if (tipo === "MESTRE") {
        return prisma.campanha.findMany({
            where: { mestreId: userId },
            include: { 
                missoes: true,
                mestre: { select: { id: true, nome: true } },
                participantes: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nome: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
    }

    if (tipo === "PLAYER") {
        const participacoes = await prisma.campanhaParticipante.findMany({
            where: { usuarioId: userId },
            include: {
                campanha: {
                    include: {
                        missoes: true,
                        mestre: { select: { id: true, nome: true } },
                        participantes: {
                            include: {
                                usuario: {
                                    select: {
                                        id: true,
                                        nome: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        return participacoes.map((p) => p.campanha);
    }

    throw new HttpError(403, "Tipo de usuário inválido");
}

export async function criar(mestreId: string, data: { nome: string; descricao?: string; sistema: SistemaRPG }) {
    const exists = await prisma.campanha.findFirst({
        where: { nome: data.nome, mestreId },
    });
    if (exists) throw new HttpError(409, "Já existe uma campanha com esse nome");

    return prisma.campanha.create({
    data: { ...data, mestreId },
        include: {
            mestre: {
                select: { id: true, nome: true }
            },
            missoes: true,
            participantes: true
        }
    });
}

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

export async function removerParticipante(mestreId: string, campanhaId: string, playerId: string) {
    const campanha = await prisma.campanha.findUnique({ where: { id: campanhaId } });

    if (!campanha) {
        throw new HttpError(404, "Campanha não encontrada");
    }

    if (campanha.mestreId !== mestreId) {
        throw new HttpError(403, "Sem permissão");
    }

    const vinculo = await prisma.campanhaParticipante.findFirst({
        where: { campanhaId, usuarioId: playerId },
    });

    if (!vinculo) {
        throw new HttpError(404, "Player não participa desta campanha");
    }

    await prisma.campanhaParticipante.delete({
        where: { id: vinculo.id },
    });
}


export async function obter(userId: string, tipo: TipoUsuario, campanhaId: string) {
    const camp = await prisma.campanha.findUnique({
        where: { id: campanhaId },
        include: {
            missoes: true,
            mestre: {
                select: {
                    id: true,
                    nome: true,
                },
            },
            participantes: {
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true,
                        },
                    },
                },
            },
        },
    });

    if (!camp) {
        throw new HttpError(404, "Campanha não encontrada");
    }

    if (tipo === "MESTRE" && camp.mestreId !== userId) {
        throw new HttpError(403, "Sem acesso à campanha");
    }

    if (tipo === "PLAYER") {
        const participa = await prisma.campanhaParticipante.findFirst({
            where: { usuarioId: userId, campanhaId },
        });

        if (!participa) {
            throw new HttpError(403, "Você não participa desta campanha");
        }
    }

    return camp;
}

export async function atualizar(mestreId: string, id: string, data: any) {
    const camp = await prisma.campanha.findUnique({ where: { id } });
    if (!camp) throw new HttpError(404, "Campanha não encontrada");
    if (camp.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à campanha");

    if (!data.nome || data.nome.trim().length === 0) {
        throw new HttpError(400, "O nome da campanha é obrigatório");
    }

    const payload: any = {};
    if (data.nome !== undefined) payload.nome = data.nome.trim();
    if (data.descricao !== undefined) payload.descricao = data.descricao;
    if (data.sistema !== undefined) payload.sistema = data.sistema;

    return prisma.campanha.update({ where: { id }, data: payload });
}

export async function remover(mestreId: string, id: string) {
    const camp = await prisma.campanha.findUnique({ where: { id } });
    if (!camp) throw new HttpError(404, "Campanha não encontrada");
    if (camp.mestreId !== mestreId) throw new HttpError(403, "Sem acesso à campanha");

    await prisma.campanha.delete({ where: { id } });
}

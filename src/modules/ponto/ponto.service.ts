import { prisma } from '../../prisma/client';
import { HttpError } from '../../utils/http-error';

export async function listar(localId: string, isMestre: boolean) {
    if (isMestre) return prisma.pontoInteresse.findMany({ where: { localId } });
    return prisma.pontoInteresse.findMany({ where: { localId } });
}

export async function criar(mestreId: string, data: any) {
    const l = await prisma.local.findUnique({
        where: { id: data.localId },
        include: { missao: { include: { campanha: true } } },
    });
    if (!l) throw new HttpError(404, 'Local não encontrado');
    if (l.missao.campanha.mestreId !== mestreId)
        throw new HttpError(403, 'Sem acesso');
    return prisma.pontoInteresse.create({ data });
}

export async function atualizar(mestreId: string, id: string, data: any) {
    const p = await prisma.pontoInteresse.findUnique({
        where: { id },
        include: { local: { include: { missao: { include: { campanha: true } } } } },
    });
    if (!p) throw new HttpError(404, 'Ponto não encontrado');
    if ((p.local.missao.campanha as any).mestreId !== mestreId)
        throw new HttpError(403, 'Sem acesso');
    return prisma.pontoInteresse.update({ where: { id }, data });
}

export async function remover(mestreId: string, id: string) {
    const p = await prisma.pontoInteresse.findUnique({
        where: { id },
        include: { local: { include: { missao: { include: { campanha: true } } } } },
    });
    if (!p) throw new HttpError(404, 'Ponto não encontrado');
    if ((p.local.missao.campanha as any).mestreId !== mestreId)
        throw new HttpError(403, 'Sem acesso');
    await prisma.pontoInteresse.delete({ where: { id } });
}

export async function obter(authUserId: string, tipo: string, id: string) {
    const ponto = await prisma.pontoInteresse.findUnique({
        where: { id },
        include: {
            local: {
                include: {
                    missao: {
                        include: { campanha: true },
                    },
                },
            },
            pistas: true,
        },
    });

    if (!ponto) throw new HttpError(404, 'Ponto não encontrado');

    if (tipo === 'MESTRE') {
        if (ponto.local.missao.campanha.mestreId !== authUserId)
            throw new HttpError(403, 'Sem acesso à missão');
        return ponto;
    }

    if (tipo === 'PLAYER') {
        if (!ponto.local.visivel)
            throw new HttpError(404, 'Ponto não encontrado');
        return ponto;
    }

    throw new HttpError(403, 'Tipo de usuário inválido');
}

export async function atualizarImagem(
    mestreId: string,
    pontoId: string,
    imagemUrl: string
) {
    const ponto = await prisma.pontoInteresse.findUnique({
        where: { id: pontoId },
        include: {
            local: {
                include: {
                    missao: { include: { campanha: true } }
                }
            }
        }
    });

    if (!ponto) throw new HttpError(404, "Ponto não encontrado");

    if (ponto.local.missao.campanha.mestreId !== mestreId) {
        throw new HttpError(403, "Sem acesso");
    }

    return prisma.pontoInteresse.update({
        where: { id: pontoId },
        data: { imagemUrl }
    });
}

export async function removerImagem(
    mestreId: string,
    pontoId: string
) {
    const ponto = await prisma.pontoInteresse.findUnique({
        where: { id: pontoId },
        include: {
            local: {
                include: {
                    missao: { include: { campanha: true } }
                }
            }
        }
    });

    if (!ponto) throw new HttpError(404, "Ponto não encontrado");

    if (ponto.local.missao.campanha.mestreId !== mestreId) {
        throw new HttpError(403, "Sem acesso");
    }

    return prisma.pontoInteresse.update({
        where: { id: pontoId },
        data: { imagemUrl: null }
    });
}
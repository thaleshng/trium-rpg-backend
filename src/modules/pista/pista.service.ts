import { prisma } from '../../prisma/client';
import { HttpError } from '../../utils/http-error';

export async function listarParaMestre(pontoId: string) {
    return prisma.pista.findMany({ where: { pontoInteresseId: pontoId } });
}

export async function listarParaPlayer(pontoId: string) {
    return prisma.pista.findMany({
        where: { pontoInteresseId: pontoId, visivel: true },
    });
}

export async function criar(mestreId: string, data: any) {
    const p = await prisma.pontoInteresse.findUnique({
        where: { id: data.pontoInteresseId },
        include: {
            local: { include: { missao: { include: { campanha: true } } } },
        },
    });
    if (!p) throw new HttpError(404, 'Ponto não encontrado');
    if ((p.local.missao.campanha as any).mestreId !== mestreId)
        throw new HttpError(403, 'Sem acesso');
    return prisma.pista.create({ data });
}

export async function atualizar(mestreId: string, id: string, data: any) {
    const pista = await prisma.pista.findUnique({
        where: { id },
        include: {
            pontoInteresse: {
                include: { local: { include: { missao: { include: { campanha: true } } } } },
            },
        },
    });
    if (!pista) throw new HttpError(404, 'Pista não encontrada');
    if (
        (pista.pontoInteresse.local.missao.campanha as any).mestreId !==
        mestreId
    )
        throw new HttpError(403, 'Sem acesso');
    return prisma.pista.update({ where: { id }, data });
}

export async function remover(mestreId: string, id: string) {
    const pista = await prisma.pista.findUnique({
        where: { id },
        include: {
            pontoInteresse: {
                include: { local: { include: { missao: { include: { campanha: true } } } } },
            },
        },
    });
    if (!pista) throw new HttpError(404, 'Pista não encontrada');
    if (
        (pista.pontoInteresse.local.missao.campanha as any).mestreId !==
        mestreId
    )
        throw new HttpError(403, 'Sem acesso');
    await prisma.pista.delete({ where: { id } });
}

/**
 * 🔹 Novo: obter pista pelo ID
 * - Mestre → qualquer pista da sua campanha
 * - Player → apenas se pista.visivel = true e local.visivel = true
 */
export async function obter(authUserId: string, tipo: string, id: string) {
    const pista = await prisma.pista.findUnique({
        where: { id },
        include: {
            pontoInteresse: {
                include: {
                    local: {
                        include: {
                            missao: { include: { campanha: true } },
                        },
                    },
                },
            },
            faixas: true,
        },
    });

    if (!pista) throw new HttpError(404, 'Pista não encontrada');

    if (tipo === 'MESTRE') {
        if (pista.pontoInteresse.local.missao.campanha.mestreId !== authUserId)
            throw new HttpError(403, 'Sem acesso à missão');
        return pista;
    }

    if (tipo === 'PLAYER') {
        // Player só pode ver se tanto o Local quanto a Pista forem visíveis
        const localVisivel = pista.pontoInteresse.local.visivel;
        if (!localVisivel || !pista.visivel)
            throw new HttpError(404, 'Pista não encontrada');
        return pista;
    }

    throw new HttpError(403, 'Tipo de usuário inválido');
}

import { prisma } from '../../prisma/client';
import { HttpError } from '../../utils/http-error';
import { assertMissaoDoMestre } from '../../utils/guards';

/**
 * Lista monstros para o Mestre
 */
export async function listarParaMestre(mestreId: string, missaoId: string) {
    await assertMissaoDoMestre(missaoId, mestreId);
    return prisma.monstro.findMany({ where: { missaoId } });
}

/**
 * Lista monstros para o Player (somente visíveis)
 */
export async function listarParaPlayer(missaoId: string) {
    return prisma.monstro.findMany({ where: { missaoId, visivel: true } });
}

/**
 * Criação (somente Mestre)
 */
export async function criar(mestreId: string, data: any) {
    await assertMissaoDoMestre(data.missaoId, mestreId);
    return prisma.monstro.create({ data });
}

/**
 * Atualização (somente Mestre)
 */
export async function atualizar(mestreId: string, id: string, data: any) {
    const m = await prisma.monstro.findUnique({
        where: { id },
        include: { missao: { include: { campanha: true } } },
    });
    if (!m) throw new HttpError(404, 'Monstro não encontrado');
    if (m.missao.campanha.mestreId !== mestreId) throw new HttpError(403, 'Sem acesso');

    return prisma.monstro.update({ where: { id }, data });
}

/**
 * Remoção (somente Mestre)
 */
export async function remover(mestreId: string, id: string) {
    const m = await prisma.monstro.findUnique({
        where: { id },
        include: { missao: { include: { campanha: true } } },
    });
    if (!m) throw new HttpError(404, 'Monstro não encontrado');
    if (m.missao.campanha.mestreId !== mestreId) throw new HttpError(403, 'Sem acesso');

    await prisma.monstro.delete({ where: { id } });
}

/**
 * Obter monstro pelo ID
 * - Mestre → qualquer monstro da campanha
 * - Player → apenas monstros visíveis
 */
export async function obter(authUserId: string, tipo: string, id: string) {
    const monstro = await prisma.monstro.findUnique({
        where: { id },
        include: {
            missao: {
                include: { campanha: true },
            },
        },
    });

    if (!monstro) throw new HttpError(404, 'Monstro não encontrado');

    // Regras de acesso
    if (tipo === 'MESTRE') {
        if (monstro.missao.campanha.mestreId !== authUserId)
            throw new HttpError(403, 'Sem acesso à missão');
        return monstro;
    }

    if (tipo === 'PLAYER') {
        if (!monstro.visivel)
            throw new HttpError(404, 'Monstro não encontrado'); // invisível → não existe para o player
        return monstro;
    }

    throw new HttpError(403, 'Tipo de usuário inválido');
}

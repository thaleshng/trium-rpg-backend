import { prisma } from '../../prisma/client';
import { HttpError } from '../../utils/http-error';
import { assertMissaoDoMestre } from '../../utils/guards';
import { TipoUsuario } from '@prisma/client';

/**
 * Listagem:
 * - Mestre → todos da missão
 * - Player → apenas o próprio personagem
 */
export async function listarPorMissao(authUserId: string, tipo: TipoUsuario, missaoId: string) {
    if (tipo === 'MESTRE') {
        await assertMissaoDoMestre(missaoId, authUserId);
        return prisma.personagem.findMany({ where: { missaoId } });
    }

    if (tipo === 'PLAYER') {
        return prisma.personagem.findMany({ where: { missaoId, usuarioId: authUserId } });
    }

    throw new HttpError(403, 'Tipo de usuário inválido');
}

/**
 * Criação:
 * - Mestre → cria personagem para qualquer usuário
 * - Player → cria apenas o próprio, e só se ainda não tiver 1 nessa missão
 */
export async function criar(authUserId: string, tipo: TipoUsuario, data: any) {
    // MESTRE cria livremente
    if (tipo === 'MESTRE') {
        await assertMissaoDoMestre(data.missaoId, authUserId);
        return prisma.personagem.create({ data });
    }

    // PLAYER → verifica se participa da campanha e se já tem personagem
    if (tipo === 'PLAYER') {
        // Verifica se a missão existe e se ele participa da campanha
        const missao = await prisma.missao.findUnique({
            where: { id: data.missaoId },
            include: { campanha: { include: { participantes: true } } },
        });

        if (!missao) throw new HttpError(404, 'Missão não encontrada');

        const participa = missao.campanha.participantes.some(p => p.usuarioId === authUserId);
        if (!participa) throw new HttpError(403, 'Você não participa desta campanha');

        // Verifica se já existe personagem do player nessa missão
        const existente = await prisma.personagem.findFirst({
            where: { usuarioId: authUserId, missaoId: data.missaoId },
        });
        if (existente) throw new HttpError(409, 'Você já possui um personagem nesta missão');

        // Cria personagem vinculado automaticamente ao player
        return prisma.personagem.create({
            data: {
                nome: data.nome,
                imagemUrl: data.imagemUrl,
                atributosJson: data.atributosJson,
                missaoId: data.missaoId,
                usuarioId: authUserId,
            },
        });
    }

    throw new HttpError(403, 'Tipo de usuário inválido');
}

/**
 * Obtém personagem (Mestre → qualquer; Player → o próprio)
 */
export async function obter(authUserId: string, id: string, tipo: TipoUsuario) {
    const p = await prisma.personagem.findUnique({
        where: { id },
        include: { usuario: true, missao: { include: { campanha: true } } },
    });
    if (!p) throw new HttpError(404, 'Personagem não encontrado');

    if (tipo === 'MESTRE' && p.missao.campanha.mestreId !== authUserId)
        throw new HttpError(403, 'Sem acesso');

    if (tipo === 'PLAYER' && p.usuarioId !== authUserId)
        throw new HttpError(403, 'Sem acesso');

    return p;
}

/**
 * Atualiza personagem (Mestre → qualquer; Player → o próprio)
 */
export async function atualizar(authUserId: string, id: string, tipo: TipoUsuario, data: any) {
    const p = await prisma.personagem.findUnique({
        where: { id },
        include: { missao: { include: { campanha: true } } },
    });
    if (!p) throw new HttpError(404, 'Personagem não encontrado');

    if (tipo === 'MESTRE' && p.missao.campanha.mestreId !== authUserId)
        throw new HttpError(403, 'Sem acesso');

    if (tipo === 'PLAYER' && p.usuarioId !== authUserId)
        throw new HttpError(403, 'Sem permissão');

    return prisma.personagem.update({ where: { id }, data });
}

/**
 * Remoção (somente Mestre)
 */
export async function remover(mestreId: string, id: string) {
    const p = await prisma.personagem.findUnique({
        where: { id },
        include: { missao: { include: { campanha: true } } },
    });
    if (!p) throw new HttpError(404, 'Personagem não encontrado');
    if (p.missao.campanha.mestreId !== mestreId) throw new HttpError(403, 'Sem acesso');

    await prisma.personagem.delete({ where: { id } });
}

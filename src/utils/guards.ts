import { prisma } from '../prisma/client';
import { HttpError } from './http-error';

export async function assertCampanhaDoMestre(campanhaId: string, mestreId: string) {
    const c = await prisma.campanha.findUnique({ where: { id: campanhaId } });
    if (!c) throw new HttpError(404, 'Campanha não encontrada');
    if (c.mestreId !== mestreId) throw new HttpError(403, 'Sem acesso à campanha');
    return c;
}

export async function assertMissaoDoMestre(missaoId: string, mestreId: string) {
    const m = await prisma.missao.findUnique({
        where: { id: missaoId },
        include: { campanha: true },
    });
    if (!m) throw new HttpError(404, 'Missão não encontrada');
    if (m.campanha.mestreId !== mestreId) throw new HttpError(403, 'Sem acesso à missão');
    return m;
}

export function assertOwner(usuarioId: string, authUserId: string) {
    if (usuarioId !== authUserId) throw new HttpError(403, 'Sem permissão para editar este recurso');
}

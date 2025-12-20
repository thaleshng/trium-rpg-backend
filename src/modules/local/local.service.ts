import { prisma } from '../../prisma/client';
import { HttpError } from '../../utils/http-error';
import { assertMissaoDoMestre } from '../../utils/guards';
import fs from "node:fs";
import path from "node:path";

const MAPAS_DIR = path.join(process.cwd(), "uploads", "mapas", "locais");

export async function listarParaMestre(mestreId: string, missaoId: string) {
    await assertMissaoDoMestre(missaoId, mestreId);
    return prisma.local.findMany({ where: { missaoId } });
}

export async function listarParaPlayer(missaoId: string) {
    return prisma.local.findMany({ where: { missaoId, visivel: true } });
}

export async function criar(mestreId: string, data: any) {
    await assertMissaoDoMestre(data.missaoId, mestreId);
    return prisma.local.create({ data });
}

export async function atualizar(mestreId: string, id: string, data: any) {
    const l = await prisma.local.findUnique({
        where: { id },
        include: { missao: { include: { campanha: true } } },
    });
    if (!l) throw new HttpError(404, 'Local não encontrado');
    if (l.missao.campanha.mestreId !== mestreId) throw new HttpError(403, 'Sem acesso');
    return prisma.local.update({ where: { id }, data });
}

export async function remover(mestreId: string, id: string) {
    const l = await prisma.local.findUnique({
        where: { id },
        include: { missao: { include: { campanha: true } } },
    });
    if (!l) throw new HttpError(404, 'Local não encontrado');
    if (l.missao.campanha.mestreId !== mestreId) throw new HttpError(403, 'Sem acesso');
    await prisma.local.delete({ where: { id } });
}

export async function obter(authUserId: string, tipo: string, id: string) {
    const local = await prisma.local.findUnique({
        where: { id },
        include: {
            missao: {
                include: { campanha: true },
            },
            pontos: true,
        },
    });

    if (!local) throw new HttpError(404, 'Local não encontrado');

    if (tipo === 'MESTRE') {
        if (local.missao.campanha.mestreId !== authUserId)
            throw new HttpError(403, 'Sem acesso à missão');
        return local;
    }

    if (tipo === 'PLAYER') {
        if (!local.visivel)
            throw new HttpError(404, 'Local não encontrado');
        return local;
    }

    throw new HttpError(403, 'Tipo de usuário inválido');
}

export async function atualizarMapa(
    mestreId: string,
    localId: string,
    mapaUrl: string
) {
    const local = await prisma.local.findUnique({
        where: { id: localId },
        include: { missao: { include: { campanha: true } } },
    });

    if (!local) throw new HttpError(404, "Local não encontrado");
    if (local.missao.campanha.mestreId !== mestreId)
        throw new HttpError(403, "Sem acesso");

    return prisma.local.update({
        where: { id: localId },
        data: { mapaUrl },
    });
}

export async function removerMapa(
    mestreId: string,
    localId: string
) {
    const local = await prisma.local.findUnique({
        where: { id: localId },
        include: { missao: { include: { campanha: true } } },
    });

    if (!local) throw new HttpError(404, "Local não encontrado");

    if (local.missao.campanha.mestreId !== mestreId)
        throw new HttpError(403, "Sem acesso");

    if (local.mapaUrl) {
        const filename = path.basename(local.mapaUrl);
        const filePath = path.join(MAPAS_DIR, filename);

        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error("Erro ao remover arquivo do mapa:", err);
            }
        }
    }

    return prisma.local.update({
        where: { id: localId },
        data: { mapaUrl: null },
    });
}
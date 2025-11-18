import { prisma } from "../../prisma/client";
import { HttpError } from "../../utils/http-error";

export async function listar(pontoInteresseId: string) {
    return prisma.faixaRolagem.findMany({
        where: { pontoInteresseId },
        orderBy: { rolagemMin: "asc" },
    });
}

export async function criar(mestreId: string, data: any) {
    const p = await prisma.pontoInteresse.findUnique({
        where: { id: data.pontoInteresseId },
        include: { local: { include: { missao: { include: { campanha: true } } } } },
    });
    if (!p) throw new HttpError(404, "Ponto de interesse não encontrado");
    if (p.local.missao.campanha.mestreId !== mestreId)
        throw new HttpError(403, "Sem acesso a esta missão");
    return prisma.faixaRolagem.create({ data });
}

export async function atualizar(mestreId: string, id: string, data: any) {
    const faixa = await prisma.faixaRolagem.findUnique({
        where: { id },
        include: { pontoInteresse: { include: { local: { include: { missao: { include: { campanha: true } } } } } } },
    });
    if (!faixa) throw new HttpError(404, "Faixa não encontrada");
    if (faixa.pontoInteresse.local.missao.campanha.mestreId !== mestreId)
        throw new HttpError(403, "Sem acesso");
    return prisma.faixaRolagem.update({ where: { id }, data });
}

export async function remover(mestreId: string, id: string) {
    const faixa = await prisma.faixaRolagem.findUnique({
        where: { id },
        include: { pontoInteresse: { include: { local: { include: { missao: { include: { campanha: true } } } } } } },
    });
    if (!faixa) throw new HttpError(404, "Faixa não encontrada");
    if (faixa.pontoInteresse.local.missao.campanha.mestreId !== mestreId)
        throw new HttpError(403, "Sem acesso");
    await prisma.faixaRolagem.delete({ where: { id } });
}

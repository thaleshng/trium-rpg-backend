-- CreateTable
CREATE TABLE "CampanhaParticipante" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "campanhaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampanhaParticipante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampanhaParticipante_usuarioId_campanhaId_key" ON "CampanhaParticipante"("usuarioId", "campanhaId");

-- AddForeignKey
ALTER TABLE "CampanhaParticipante" ADD CONSTRAINT "CampanhaParticipante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampanhaParticipante" ADD CONSTRAINT "CampanhaParticipante_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

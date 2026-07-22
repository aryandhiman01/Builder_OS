/*
  Warnings:

  - A unique constraint covering the columns `[researchId]` on the table `PRD` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Idea" DROP CONSTRAINT "Idea_projectId_fkey";

-- AlterTable
ALTER TABLE "PRD" ADD COLUMN     "researchId" TEXT;

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT,
    "tokens" INTEGER,
    "generationTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "prdId" TEXT NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_prdId_key" ON "Roadmap"("prdId");

-- CreateIndex
CREATE INDEX "Roadmap_projectId_idx" ON "Roadmap"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "PRD_researchId_key" ON "PRD"("researchId");

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRD" ADD CONSTRAINT "PRD_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "Research"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_prdId_fkey" FOREIGN KEY ("prdId") REFERENCES "PRD"("id") ON DELETE CASCADE ON UPDATE CASCADE;

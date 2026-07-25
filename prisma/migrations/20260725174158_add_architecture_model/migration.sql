-- AlterTable
ALTER TABLE "Research" ALTER COLUMN "model" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Architecture" (
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
    "roadmapId" TEXT,

    CONSTRAINT "Architecture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Architecture_roadmapId_key" ON "Architecture"("roadmapId");

-- CreateIndex
CREATE INDEX "Architecture_projectId_idx" ON "Architecture"("projectId");

-- AddForeignKey
ALTER TABLE "Architecture" ADD CONSTRAINT "Architecture_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Architecture" ADD CONSTRAINT "Architecture_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

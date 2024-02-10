-- CreateTable
CREATE TABLE "Polls" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollOptions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pollsId" TEXT NOT NULL,

    CONSTRAINT "PollOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pollsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pollOptionsId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_sessionId_pollsId_key" ON "Vote"("sessionId", "pollsId");

-- AddForeignKey
ALTER TABLE "PollOptions" ADD CONSTRAINT "PollOptions_pollsId_fkey" FOREIGN KEY ("pollsId") REFERENCES "Polls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollOptionsId_fkey" FOREIGN KEY ("pollOptionsId") REFERENCES "PollOptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollsId_fkey" FOREIGN KEY ("pollsId") REFERENCES "Polls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

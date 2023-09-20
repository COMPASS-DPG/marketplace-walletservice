-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('admin', 'provider', 'user');

-- CreateEnum
CREATE TYPE "WalletStatus" AS ENUM ('active', 'inactive', 'frozen');

-- CreateTable
CREATE TABLE "wallets" (
    "walletId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "WalletType" NOT NULL,
    "status" "WalletStatus" NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("walletId")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transactionId" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transactionId")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "wallets"("walletId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_toId_fkey" FOREIGN KEY ("toId") REFERENCES "wallets"("walletId") ON DELETE RESTRICT ON UPDATE CASCADE;

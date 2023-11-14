import { PrismaClient, TransactionType, WalletStatus, WalletType } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  const wallet1 = await prisma.wallets.create({
    data: {
      userId: 1,
      type: WalletType.consumer,
      status: WalletStatus.active,
      credits: 125,
    },
  });

  const wallet2 = await prisma.wallets.create({
    data: {
      userId: 2,
      type: WalletType.admin,
      status: WalletStatus.active,
    },
  });

  const wallet3 = await prisma.wallets.create({
    data: {
      userId: 3,
      type: WalletType.provider,
      status: WalletStatus.active,
    }
  });

  const wallet4 = await prisma.wallets.create({
    data: {
      userId: 4,
      type: WalletType.consumer,
      status: WalletStatus.active,
      credits: 300,
    },
  });

  const transaction1 = await prisma.transactions.create({
    data: {
      credits: 100,
      fromId: 2, 
      toId: 1,
      type: TransactionType.creditRequest,
    }
  });

  const transaction2 = await prisma.transactions.create({
    data: {
      credits: 200,
      fromId: 4,
      toId: 3,
      type: TransactionType.purchase,
    }
  });

  const transaction3 = await prisma.transactions.create({
    data: {
      credits: 200,
      fromId: 3,
      toId: 2,
      type: TransactionType.settlement
    }
  })
  console.log({ wallet1, wallet2, wallet3, wallet4, transaction1, transaction2, transaction3 });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
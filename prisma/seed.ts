import { PrismaClient, TransactionType, WalletStatus, WalletType } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  const wallet1 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440000",
      type: WalletType.CONSUMER,
      credits: 125,
    },
  });

  const wallet2 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440001",
      type: WalletType.CONSUMER,
      credits: 200
    },
  });

  const wallet3 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440002",
      type: WalletType.PROVIDER,
      credits: 100
    }
  });

  const wallet4 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440003",
      type: WalletType.ADMIN,
      credits: 300,
    },
  });

  const transaction1 = await prisma.transactions.create({
    data: {
      credits: 100,
      fromId: 4, 
      toId: 1,
      type: TransactionType.ADD_CREDITS,
      description: "Credits added by the admin"
    }
  });

  const transaction2 = await prisma.transactions.create({
    data: {
      credits: 200,
      fromId: 1,
      toId: 3,
      type: TransactionType.PURCHASE,
      description: "Purchased course ABC"
    }
  });

  const transaction3 = await prisma.transactions.create({
    data: {
      credits: 200,
      fromId: 3,
      toId: 4,
      type: TransactionType.SETTLEMENT,
      description: "Credit balance settled"
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
import { PrismaClient, TransactionType, WalletStatus, WalletType } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  const wallet1 = await prisma.wallets.create({
    data: {
      userId: "4d45a9e9-4a4d-4c92-aaea-7b5abbd6ff98",
      type: WalletType.CONSUMER,
      credits: 125,
    },
  });

  const wallet2 = await prisma.wallets.create({
    data: {
      userId: "abaa7220-5d2e-4e05-842a-95b2c4ce1876",
      type: WalletType.CONSUMER,
      credits: 200
    },
  });

  const wallet3 = await prisma.wallets.create({
    data: {
      userId: "0f5d0b13-8d72-46c9-a7c4-c1f7e5aa1f17",
      type: WalletType.CONSUMER,
      credits: 100
    }
  });

  const wallet4 = await prisma.wallets.create({
    data: {
      userId: "bbf1f7cf-4216-458e-8d98-0d9204ae57ef",
      type: WalletType.CONSUMER,
      credits: 300,
    },
  });

  const wallet5 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440010",
      type: WalletType.PROVIDER,
      credits: 300,
    },
  });

  const wallet6 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440011",
      type: WalletType.PROVIDER,
      credits: 300,
    },
  });

  const wallet7 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440012",
      type: WalletType.PROVIDER,
      credits: 300,
    },
  });

  const wallet8 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440013",
      type: WalletType.PROVIDER,
      credits: 300,
    },
  });

  const wallet9 = await prisma.wallets.create({
    data: {
      userId: "123e4567-e89b-42d3-a456-556642440020",
      type: WalletType.ADMIN,
      credits: 300,
    },
  });

  const transaction1 = await prisma.transactions.create({
    data: {
      credits: 100,
      fromId: 9, 
      toId: 1,
      type: TransactionType.ADD_CREDITS,
      description: "Credits added by the admin"
    }
  });

  const transaction2 = await prisma.transactions.create({
    data: {
      credits: 20,
      fromId: 1,
      toId: 5,
      type: TransactionType.PURCHASE,
      description: "Purchased course ABC"
    }
  });

  const transaction3 = await prisma.transactions.create({
    data: {
      credits: 200,
      fromId: 1,
      toId: 5,
      type: TransactionType.PURCHASE,
      description: "Purchased course XYZ"
    }
  });

  const transaction4 = await prisma.transactions.create({
    data: {
      credits: 200,
      fromId: 5,
      toId: 9,
      type: TransactionType.SETTLEMENT,
      description: "Credit balance settled"
    }
  })
  console.log({ wallet1, wallet2, wallet3, wallet4, wallet5, wallet6, wallet7, wallet8, 
    transaction1, transaction2, transaction3, transaction4 });
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
import { PrismaClient, TransactionType, WalletStatus, WalletType } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const wallet = await prisma.transactions.create({
    data: {
      credits: 15,
      fromId: 6, 
      toId: 10,
      type: TransactionType.settlement,

    }
  })
  console.log({ wallet })
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
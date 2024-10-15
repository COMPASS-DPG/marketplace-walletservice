import { Logger } from '@nestjs/common';
import { Prisma, PrismaClient, TransactionType, WalletStatus, WalletType } from '@prisma/client'
import * as fs from "fs";
import { createViewQueries } from './scripts/createViewQueries';
import { copyViewQueries } from './scripts/moveViewsQueries';
const { Client } = require('pg');

const prisma = new PrismaClient();
const telemetryDbName = process.env.TELEMETRY_DATABASE_NAME;

async function seed() {

  const wallet1 = await prisma.wallets.create({
    data: {
      userId: "9f4611d4-ab92-4acd-b3ce-13594e362eca",
      type: WalletType.CONSUMER,
      credits: 125,
    },
  });

  const wallet2 = await prisma.wallets.create({
    data: {
      userId: "7eddc220-f33d-476c-b204-041e584585c6",
      type: WalletType.CONSUMER,
      credits: 200
    },
  });

  const wallet3 = await prisma.wallets.create({
    data: {
      userId: "836ba369-fc24-4464-95ec-505d61b67ef0",
      type: WalletType.CONSUMER,
      credits: 100
    }
  });

  const wallet4 = await prisma.wallets.create({
    data: {
      userId: "c8a43816-5a1b-4e29-9e1f-e8ef22efc669",
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
      userId: "890f2839-866f-4524-9eac-bebe0d35d607",
      type: WalletType.ADMIN,
      credits: 450,
    },
  });

  const wallet10 = await prisma.wallets.create({
    data: {
      userId: "87fd80a9-63e9-4e90-81bb-4b6956c2561b",
      type: WalletType.ADMIN,
      credits: 300,
    },
  });

  const transaction1 = await prisma.transactions.create({
    data: {
      credits: 100,
      fromId: wallet9.walletId, 
      toId: wallet1.walletId,
      type: TransactionType.ADD_CREDITS,
      description: "Credits added by the admin"
    }
  });

  const transaction2 = await prisma.transactions.create({
    data: {
      credits: 20,
      fromId: wallet1.walletId,
      toId: wallet5.walletId,
      type: TransactionType.PURCHASE,
      description: "Purchased course ABC"
    }
  });

  const transaction3 = await prisma.transactions.create({
    data: {
      credits: 200,
      fromId: wallet1.walletId,
      toId: wallet5.walletId,
      type: TransactionType.PURCHASE,
      description: "Purchased course XYZ"
    }
  });

  const transaction4 = await prisma.transactions.create({
    data: {
      credits: 200,
      fromId: wallet5.walletId,
      toId: wallet9.walletId,
      type: TransactionType.SETTLEMENT,
      description: "Credit balance settled"
    }
  })
  console.log({ wallet1, wallet2, wallet3, wallet4, wallet5, wallet6, wallet7, wallet8, wallet9, wallet10,
    transaction1, transaction2, transaction3, transaction4 });
}

async function createViews() {
  let logger = new Logger("CreatingViews");
  logger.log(`Started creating views`);

  for (const sql of createViewQueries) {
    logger.log(sql);
    await prisma.$executeRaw`${Prisma.raw(sql)}`;
  }

  const res:any = await prisma.$queryRaw`${Prisma.raw(`SELECT datname FROM pg_database WHERE datname = '${telemetryDbName}'`)}`;
  if (res.length === 0) {
    // Create the telemetry-views database if it does not exist
    await prisma.$queryRaw`${Prisma.raw(`CREATE DATABASE "${telemetryDbName}"`)}`;
    logger.log(`Database "${telemetryDbName}" created.`);
  } else {
    logger.log(`Database "${telemetryDbName}" already exists.`);
  }

  logger.log(`Successfully created views`);
}

async function moveViews() {
  let logger = new Logger("MovingViews");

  const telemetryClient =  new Client({
    user: process.env.DATABASE_USERNAME,
    host: '172.17.0.1',
    database: process.env.TELEMETRY_DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  });

  await telemetryClient.connect();

  logger.log(`Started moving views`);
  
  for (const sql of copyViewQueries) {
    logger.log(sql);
    await telemetryClient.query(sql);
  }

  await telemetryClient.end();

  logger.log(`Successfully moved views`);
}

async function main() {
  try {
    await seed();
    await createViews();
    await moveViews();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
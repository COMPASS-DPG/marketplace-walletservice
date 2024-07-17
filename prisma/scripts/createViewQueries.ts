export const createViewQueries = [
    `
        DROP VIEW IF EXISTS telemetry_transactions
    `,

    `
        CREATE VIEW telemetry_transactions AS
        SELECT 
            wf."userId" AS "fromUserId",
            wt."userId" AS "toUserId",
            t.credits AS "amount",
            t.type,
            t.description,
            t."createdAt" AS "transactionDate"
        FROM
            transactions t
        JOIN
            wallets wf ON t."fromId" = wf."walletId"
        JOIN
            wallets wt ON t."toId" = wt."walletId"
    `
];
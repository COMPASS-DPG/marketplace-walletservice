const dbName = process.env.DATABASE_NAME;
const dbUserName = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbPort = process.env.DATABASE_PORT;
const dbHost = '172.17.0.1';

export const copyViewQueries = [
    `
        CREATE EXTENSION IF NOT EXISTS postgres_fdw
    `,
    `
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_foreign_server
                WHERE srvname = 'wallet_server'
            ) THEN
                EXECUTE 'CREATE SERVER wallet_server
                        FOREIGN DATA WRAPPER postgres_fdw
                        OPTIONS (host ''${dbHost}'', dbname ''${dbName}'', port ''${dbPort}'')';
            END IF;
        END $$;
    `,
    `
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_user_mappings
                WHERE srvname = 'wallet_server' AND usename = '${dbUserName}'
            ) THEN
                EXECUTE 'CREATE USER MAPPING FOR ${dbUserName}
                        SERVER wallet_server
                        OPTIONS (user ''${dbUserName}'', password ''${dbPassword}'')';
            END IF;
        END $$;
    `,
    `
        CREATE FOREIGN TABLE telemetry_transactions (
            "fromUserId" text,
            "toUserId" text,
            "amount" integer,
            "type" text,
            "description" text,
            "transactionDate" timestamp(3) without time zone
        )
        SERVER wallet_server
        OPTIONS (schema_name 'public', table_name 'telemetry_transactions');
    `
];
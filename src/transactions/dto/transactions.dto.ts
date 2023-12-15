import { TransactionType } from "@prisma/client";

export class Transaction {
    
    readonly transactionId: number;
    readonly fromId: number;
    readonly toId: number;
    readonly credits: number;
    readonly type: TransactionType;
    readonly description: string;
    readonly createdAt: Date;
}
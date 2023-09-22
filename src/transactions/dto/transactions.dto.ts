import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";

export class Transaction {
    @ApiProperty()
    transactionId: number;

    @ApiProperty()
    fromId: number;

    @ApiProperty()
    toId: number;

    @ApiProperty()
    credits: number;

    @ApiProperty()
    type: TransactionType;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Date;
}
import { ApiProperty } from "@nestjs/swagger";
import { WalletStatus, WalletType } from "@prisma/client";
import { IsEnum, IsInt, IsUUID, Min } from "class-validator";

export class WalletCredits {

    @ApiProperty()
    @IsInt()
    @Min(0)
    credits: number;
}

export class CreateWalletDto {

    // User UUID
    @ApiProperty()
    @IsUUID()
    userId: string;

    // The role of the user wallet belongs to
    @ApiProperty()
    @IsEnum(WalletType)
    type: WalletType;

    // specifying the number of credits while creating the wallet
    @ApiProperty()
    @IsInt()
    @Min(0)
    credits: number;
}

export class CreateWalletResponse extends CreateWalletDto {

    readonly walletId: number;
    readonly status: WalletStatus;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
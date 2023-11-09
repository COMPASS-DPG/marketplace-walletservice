import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsUUID, Min } from "class-validator";

export class CreditsDto {

    // consumer ID
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    consumerId: string;

    // Number of credits transferred
    @ApiProperty()
    @IsInt()
    @Min(0)
    credits: number;
}

export class PurchaseDto {

    // provider ID
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    providerId: string;

    // Number of credits transferred
    @ApiProperty()
    @IsInt()
    @Min(0)
    credits: number;
}

export class SettlementDto {

    // admin ID
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    adminId: string;

    // Number of credits transferred
    @ApiProperty()
    @IsInt()
    @Min(0)
    credits: number;
}

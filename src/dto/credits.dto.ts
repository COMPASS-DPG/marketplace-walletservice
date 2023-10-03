import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreditsDto {

    // consumer ID
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    consumerId: number;

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
    @IsInt()
    @Min(1)
    providerId: number;

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
    @IsInt()
    @Min(1)
    adminId: number;

    // Number of credits transferred
    @ApiProperty()
    @IsInt()
    @Min(0)
    credits: number;
}

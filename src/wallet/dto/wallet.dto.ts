import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class WalletCredits {

    @ApiProperty()
    @IsInt()
    @Min(0)
    credits: number;
}
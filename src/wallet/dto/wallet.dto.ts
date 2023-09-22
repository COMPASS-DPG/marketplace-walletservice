import { ApiProperty } from "@nestjs/swagger";

export class WalletCredits {

    @ApiProperty()
    credits: number;
}
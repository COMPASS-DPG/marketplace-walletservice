import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";


export class CreditsDto {

    // End user ID
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    userId: number;

    // Number of credits transferred
    @ApiProperty()
    @IsInt()
    credits: number;
}